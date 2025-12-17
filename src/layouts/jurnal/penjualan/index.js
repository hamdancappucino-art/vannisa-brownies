import React, { useState, useEffect } from "react";
import API from "api/api";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";

import laporanPenjualanTableData from "./data/penjualan";

export default function LaporanPenjualan() {
  const { rows: initialRows, columns } = laporanPenjualanTableData;

  const [data, setData] = useState(initialRows);

  const [open, setOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const [form, setForm] = useState({
    id_jurnal_penjualan: "",
    id_penjualan: "",
    tanggal: "",
    kode: "",
    nominal: "",
    tipe_balance: "",
    keterangan: "",
    created_at: "",
  });

  useEffect(() => {
    API.get("/jurnal-penjualan")
      .then((res) => {
        const mapped = res.data.map((row) => ({
          ...row,
          id_penjualan: row.id_transaksi
        }));
        setData(mapped);
      })
      .catch((err) => {
        console.error("Gagal load jurnal:", err);
      });
  }, []);

  // OPEN EDIT
  function openEdit(i) {
    setEditingIndex(i);
    setForm({ ...data[i] });
    setOpen(true);
  }

  // SAVE EDIT
  function save() {
    const id = form.id_jurnal_penjualan;

    API.put(`/jurnal-penjualan/${id}`, {
      tanggal: form.tanggal,
      id_coa: form.id_coa || 3,
      nominal: Number(form.nominal),
      tipe_balance: form.tipe_balance || "kredit",
      keterangan: form.keterangan
    })
      .then(() => {
        const updated = [...data];
        updated[editingIndex] = {
          ...form,
          nominal: Number(form.nominal)
        };
        setData(updated);
        setOpen(false);
      })
      .catch((err) => {
        console.error("Gagal update jurnal:", err);
        alert("Gagal update data");
      });
  }

  // DELETE ROW
  function remove(i) {
    if (!confirm("Hapus data ini?")) return;

    const id = data[i].id_jurnal_penjualan;

    API.delete(`/jurnal-penjualan/${id}`)
      .then(() => {
        setData((prev) => prev.filter((_, idx) => idx !== i));
      })
      .catch((err) => {
        console.error("Gagal hapus jurnal:", err);
        alert("Gagal menghapus data");
      });
  }

  function formatDate(dateString) {
    if (!dateString) return "";

    // handle format "YYYY-MM-DD HH:mm:ss"
    if (dateString.includes(" ")) {
      return dateString.split(" ")[0];
    }

    // handle format ISO
    if (dateString.includes("T")) {
      return dateString.split("T")[0];
    }

    return dateString;
  }

  // BUILD TABLE ROWS (untuk ditampilkan di Soft UI Dashboard)
  const tableRows = data.map((row, index) => ({
    id_jurnal_penjualan: row.id_jurnal_penjualan,
    id_penjualan: row.id_penjualan,

    tanggal: (
      <SoftTypography variant="caption" color="text">
        {formatDate(row.tanggal)}
      </SoftTypography>
    ),
    kode: (
      <SoftTypography variant="caption" color="text">
        {row.kode}
      </SoftTypography>
    ),
    nominal: (
      <SoftTypography variant="caption" color="text">
        Rp{Number(row.nominal).toLocaleString("id-ID")}
      </SoftTypography>
    ),
    tipe_balance: (
      <SoftTypography variant="caption" color="text">
        {row.tipe_balance}
      </SoftTypography>
    ),
    keterangan: (
      <SoftTypography variant="caption" color="text">
        {row.keterangan}
      </SoftTypography>
    ),
    created_at: (
      <SoftTypography variant="caption" color="text">
        {formatDate(row.created_at)}  
      </SoftTypography>
    ),

    action: (
      <SoftBox display="flex" justifyContent="center" gap={1}>
        <IconButton color="info" size="small" onClick={() => openEdit(index)}>
          <EditIcon />
        </IconButton>
        <IconButton color="error" size="small" sx={{ color: "black !important" }} onClick={() => remove(index)}>
          <DeleteIcon />
        </IconButton>
      </SoftBox>
    ),
  }));

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <SoftBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              {/* FILTER */}
              <SoftBox p={3}>
                <SoftTypography variant="h6">Jurnal Penjualan</SoftTypography>
                <Grid container spacing={2} mb={2} alignItems="flex-end">
                  <Grid item xs={12} md={3}>
                    <SoftTypography fontSize="14px" fontWeight="medium">
                      Tanggal Awal
                    </SoftTypography>
                    <TextField type="date" fullWidth size="medium" />
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <SoftTypography fontSize="14px" fontWeight="medium">
                      Tanggal Akhir
                    </SoftTypography>
                    <TextField type="date" fullWidth size="medium" />
                  </Grid>

                  <Grid item xs={12} md={1.5}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{ mt: { xs: 4, md: 4 } }}
                    >
                      <Icon sx={{ mr: 1, color: "white !important" }}>search</Icon>
                      <SoftTypography fontSize="13px" fontWeight="medium" color="white">
                        Tampilkan
                      </SoftTypography>
                    </Button>
                  </Grid>
                </Grid>
              </SoftBox>

              {/* TABLE */}
              <SoftBox
                sx={{
                  "& .MuiTableRow-root:not(:last-child)": {
                    "& td": {
                      borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                        `${borderWidth[1]} solid ${borderColor}`,
                    },
                  },
                }}
              >
                <Table
                  columns={[...columns, { name: "action", align: "center", label: "Aksi" }]}
                  rows={tableRows}
                />
              </SoftBox>
            </Card>
          </Grid>
        </Grid>
      </SoftBox>

      {/* MODAL EDIT */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            width: 480,
            p: 3,
            bgcolor: "background.paper",
            mx: "auto",
            mt: "10vh",
            borderRadius: 1,
          }}
        >
          <SoftTypography variant="h6" mb={2}>
            Edit Data Jurnal Penjualan
          </SoftTypography>

          {[
            "tanggal",
            "kode",
            "nominal",
            "tipe_balance",
            "keterangan",
            "created_at",
          ].map((field) => (
            <Box key={field} mb={2}>
              <SoftTypography variant="caption">
                {field.toUpperCase()}
              </SoftTypography>

              <TextField
                fullWidth
                type={field === "tanggal" || field === "created_at" ? "date" : "text"}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              />
            </Box>
          ))}

          <Box mt={3} textAlign="right">
            <Button onClick={() => setOpen(false)} sx={{ color: "red", mr: 2 }}>
              Batal
            </Button>
            <Button variant="contained" color="info" onClick={save}>
              Simpan
            </Button>
          </Box>
        </Box>
      </Modal>

      <Footer />
    </DashboardLayout>
  );
}
