import React, { useState } from "react";

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

import laporanDPTableData from "./data/dp";

export default function JurnalDP() {
  const { rows: initialRows, columns } = laporanDPTableData;

  // langsung pakai data JSON tanpa parsing JSX
  const [data, setData] = useState(initialRows);

  const [open, setOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const [form, setForm] = useState({
    id_jurnal_dp: "",
    id_dp: "",
    tanggal: "",
    kode: "",
    nominal: "",
    tipe_balance: "",
    keterangan: "",
    created_at: "",
  });

  // OPEN EDIT
  function openEdit(i) {
    setEditingIndex(i);
    setForm({ ...data[i] });
    setOpen(true);
  }

  // SAVE EDIT
  function save() {
    const updated = [...data];
    updated[editingIndex] = { ...form, total: Number(form.total) };
    setData(updated);
    setOpen(false);
  }

  // DELETE ROW
  function remove(i) {
    if (!confirm("Hapus data ini?")) return;
    setData((prev) => prev.filter((_, idx) => idx !== i));
  }

  // BUILD TABLE ROWS (untuk ditampilkan di Soft UI Dashboard)
  const tableRows = data.map((row, index) => ({
    id_jurnal_dp: row.id_jurnal_dp,
    id_dp: row.id_dp,

    tanggal: (
      <SoftTypography variant="caption" color="text">
        {row.tanggal}
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
        {row.created_at}
      </SoftTypography>
    ),
    action: (
      <SoftBox display="flex" justifyContent="center" gap={1}>
        <IconButton color="info" size="small" onClick={() => openEdit(index)}>
          <EditIcon />
        </IconButton>
        <IconButton color="error" size="small" onClick={() => remove(index)}>
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
                <SoftTypography variant="h6">Jurnal DP</SoftTypography>
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
            Edit Data Jurnal DP
          </SoftTypography>

          {[
            "tanggal",
            "kode",
            "nominal",
            "tipe_balance",
            "keterangan",
            "created_at",
          ].map((f) => (
            <Box key={f} mb={2}>
              <SoftTypography variant="caption" fontWeight="medium">
                {f.toUpperCase()}
              </SoftTypography>
              <TextField
                fullWidth
                type={f === "tanggal" ? "date" : "text"}
                value={form[f]}
                onChange={(e) => setForm({ ...form, [f]: e.target.value })}
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
