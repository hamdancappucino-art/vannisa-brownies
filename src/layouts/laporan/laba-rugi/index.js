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

import laporanLabaRugiTable from "./data/labarugi";

export default function LaporanLabaRugi() {
  const { rows: initialRows, columns } = laporanLabaRugiTable;

  const [data, setData] = useState(initialRows);
  const [open, setOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  // FORM
  const [form, setForm] = useState({
    id_laporan: "",
    tanggal_awal: "",
    tanggal_akhir: "",
    total_pendapatan: "",
    total_beban: "",
    laba_kotor: "",
    laba_bersih: "",
    periode: "",
    created_at: "",
  });

  // Open Edit
  function openEdit(i) {
    setEditingIndex(i);
    setForm({ ...data[i] });
    setOpen(true);
  }

  // Save Edit
  function save() {
    const updated = [...data];
    updated[editingIndex] = {
      ...form,
      total_pendapatan: Number(form.total_pendapatan),
      total_beban: Number(form.total_beban),
      laba_kotor: Number(form.total_pendapatan) - Number(form.total_beban),
      laba_bersih: Number(form.total_pendapatan) - Number(form.total_beban),
    };
    setData(updated);
    setOpen(false);
  }

  // DELETE
  function remove(i) {
    if (!confirm("Hapus data ini?")) return;
    setData((prev) => prev.filter((_, idx) => idx !== i));
  }

  // Build Table Rows
  const tableRows = data.map((row, index) => ({
    id_laporan: <SoftTypography variant="caption">{row.id_laporan}</SoftTypography>,

    tanggal_awal: (
      <SoftTypography variant="caption">{row.tanggal_awal}</SoftTypography>
    ),

    tanggal_akhir: (
      <SoftTypography variant="caption">{row.tanggal_akhir}</SoftTypography>
    ),

    total_pendapatan: (
      <SoftTypography variant="caption">
        Rp{row.total_pendapatan.toLocaleString("id-ID")}
      </SoftTypography>
    ),

    total_beban: (
      <SoftTypography variant="caption">
        Rp{row.total_beban.toLocaleString("id-ID")}
      </SoftTypography>
    ),

    laba_kotor: (
      <SoftTypography variant="caption">
        Rp{row.laba_kotor.toLocaleString("id-ID")}
      </SoftTypography>
    ),

    laba_bersih: (
      <SoftTypography
        variant="caption"
        color={row.laba_bersih >= 0 ? "success" : "error"}
      >
        Rp{row.laba_bersih.toLocaleString("id-ID")}
      </SoftTypography>
    ),

    periode: <SoftTypography variant="caption">{row.periode}</SoftTypography>,
    created_at: <SoftTypography variant="caption">{row.created_at}</SoftTypography>,

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

  // Summary Perhitungan
  const totalPendapatan = data.reduce((sum, r) => sum + r.total_pendapatan, 0);
  const totalBeban = data.reduce((sum, r) => sum + r.total_beban, 0);
  const labaBersih = totalPendapatan - totalBeban;

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <SoftBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              {/* FILTER */}
              <SoftBox p={3}>
                <SoftTypography variant="h6">Laporan Laba Rugi</SoftTypography>

                <Grid container spacing={2} mt={1.5} mb={2}>
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
                      sx={{ mt: { xs: 4, md: 2.5 } }}
                    >
                      <Icon sx={{ mr: 1, color: "white !important" }}>search</Icon>
                      <SoftTypography fontSize="13px" color="white">
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

          {/* SUMMARY */}
          <Grid item xs={12}>
            <Card>
              <SoftBox p={3}>
                <SoftTypography variant="h6" mb={2}>
                  Ringkasan Laba Rugi
                </SoftTypography>

                <SoftTypography variant="body2">
                  <b>Total Pendapatan:</b> Rp{totalPendapatan.toLocaleString("id-ID")}
                </SoftTypography>

                <SoftTypography variant="body2">
                  <b>Total Beban:</b> Rp{totalBeban.toLocaleString("id-ID")}
                </SoftTypography>

                <SoftTypography
                  variant="body2"
                  color={labaBersih >= 0 ? "success" : "error"}
                  mt={1}
                >
                  <b>Laba Bersih:</b> Rp{labaBersih.toLocaleString("id-ID")}
                </SoftTypography>
              </SoftBox>
            </Card>
          </Grid>
        </Grid>
      </SoftBox>

      {/* MODAL EDIT */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            width: 500,
            p: 3,
            bgcolor: "background.paper",
            mx: "auto",
            mt: "10vh",
            borderRadius: 1,
          }}
        >
          <SoftTypography variant="h6" mb={2}>
            Edit Laporan Laba Rugi
          </SoftTypography>

          {Object.keys(form).map((f) => (
            <Box key={f} mb={2}>
              <SoftTypography variant="caption">{f.toUpperCase()}</SoftTypography>

              <TextField
                fullWidth
                type={f.includes("tanggal") ? "date" : "text"}
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