import API from "api/api";
import React, { useEffect, useState } from "react";

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
  const { columns } = laporanDPTableData;

  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const [form, setForm] = useState({
    id_jurnal_dp: "",
    tanggal: "",
    kode: "",
    nominal: "",
    tipe_balance: "",
    keterangan: "",
    created_at: "",
  });

  /* =======================
   * FETCH DATA
   * ======================= */
  const fetchData = async () => {
    try {
      const res = await API.get("/jurnal-dp");
      setData(res.data);
    } catch (err) {
      alert("Gagal mengambil data jurnal DP");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* =======================
   * EDIT
   * ======================= */
  function openEdit(i) {
    setEditingIndex(i);
    setForm({ ...data[i] });
    setOpen(true);
  }

  async function save() {
    try {
      await API.put(`/jurnal-dp/${form.id_jurnal_dp}`, {
        tanggal: form.tanggal,
        nominal: form.nominal,
        keterangan: form.keterangan,
      });

      setOpen(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal update jurnal DP");
    }
  }

  /* =======================
   * DELETE
   * ======================= */
  async function remove(i) {
    if (!confirm("Hapus data ini?")) return;

    try {
      const id = data[i].id_jurnal_dp;
      await API.delete(`/jurnal-dp/${id}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal hapus jurnal DP");
    }
  }

  /* =======================
   * TABLE RENDER
   * ======================= */
  const tableRows = data.map((row, index) => ({
    id_jurnal_dp: (
      <SoftTypography variant="caption">{row.id_jurnal_dp}</SoftTypography>
    ),
    id_dp: (
      <SoftTypography variant="caption">{row.id_dp}</SoftTypography>
    ),
    tanggal: (
      <SoftTypography variant="caption">{row.tanggal}</SoftTypography>
    ),
    kode: (
      <SoftTypography variant="caption">{row.kode}</SoftTypography>
    ),
    nominal: (
      <SoftTypography variant="caption">
        Rp{Number(row.nominal).toLocaleString("id-ID")}
      </SoftTypography>
    ),
    tipe_balance: (
      <SoftTypography variant="caption">{row.tipe_balance}</SoftTypography>
    ),
    keterangan: (
      <SoftTypography variant="caption">{row.keterangan}</SoftTypography>
    ),
    created_at: (
      <SoftTypography variant="caption">{row.created_at}</SoftTypography>
    ),
    action: (
      <SoftBox display="flex" justifyContent="center" gap={1}>
        <IconButton size="small" color="info" onClick={() => openEdit(index)}>
          <EditIcon />
        </IconButton>
        <IconButton size="small" color="error" onClick={() => remove(index)}>
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
