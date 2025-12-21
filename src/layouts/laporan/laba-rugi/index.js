import React, { useState, useEffect } from "react";
import API from "api/api";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";

import laporanLabaRugiTable from "./data/labarugi";

export default function LaporanLabaRugi() {
  const { columns } = laporanLabaRugiTable;
  const [data, setData] = useState([]);

  const [open, setOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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

  async function fetchData() {
    try {
      let url = "/laporan-laba-rugi";

      if (startDate && endDate) {
        url += `?start=${startDate}&end=${endDate}`;
      }

      const res = await API.get(url);
      setData(res.data.data || []);
    } catch (err) {
      console.error(err);
      alert("Gagal mengambil laporan laba rugi");
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function generateLaporan() {
    if (!startDate || !endDate) {
      alert("Tanggal awal & akhir wajib diisi");
      return;
    }

    try {
      await API.get(
        `/laporan-laba-rugi/generate?start=${startDate}&end=${endDate}`
      );

      await fetchData();
      alert("Laporan laba rugi berhasil digenerate");
    } catch (err) {
      console.error(err);
      alert("Gagal generate laporan laba rugi");
    }
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

  const sortedData = [...data].sort(
    (a, b) => a.id_laporan - b.id_laporan
  );

  function formatDate(dateString) {
    if (!dateString) return "";
    if (dateString.includes("T")) return dateString.split("T")[0];
    if (dateString.includes(" ")) return dateString.split(" ")[0];
    return dateString;
  }

  // Build Table Rows
  const tableRows = data.map((row) => ({
    id_laporan: <SoftTypography variant="caption">{row.id_laporan}</SoftTypography>,

    tanggal_awal: (
      <SoftTypography variant="caption">
        {formatDate(row.tanggal_awal)}
      </SoftTypography>
    ),

    tanggal_akhir: (
      <SoftTypography variant="caption">
        {formatDate(row.tanggal_akhir)}
      </SoftTypography>
    ),

    total_pendapatan: (
      <SoftTypography variant="caption">
        Rp{Number(row.total_pendapatan).toLocaleString("id-ID")}
      </SoftTypography>
    ),

    total_beban: (
      <SoftTypography variant="caption">
        Rp{Number(row.total_beban).toLocaleString("id-ID")}
      </SoftTypography>
    ),

    laba_kotor: (
      <SoftTypography variant="caption">
        Rp{Number(row.laba_kotor).toLocaleString("id-ID")}
      </SoftTypography>
    ),

    laba_bersih: (
      <SoftTypography
        variant="caption"
        color={Number(row.laba_bersih) >= 0 ? "success" : "error"}
      >
        Rp{Math.abs(Number(row.laba_bersih)).toLocaleString("id-ID")}
      </SoftTypography>
    ),

    periode: <SoftTypography variant="caption">{row.periode}</SoftTypography>,
    created_at: <SoftTypography variant="caption">{formatDate(row.created_at)}</SoftTypography>,
  }));

  // Summary Perhitungan
  const totalPendapatan = data.reduce(
    (sum, r) => sum + Number(r.total_pendapatan),
    0
  );

  const totalBeban = data.reduce(
    (sum, r) => sum + Number(r.total_beban),
    0
  );

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
                    <SoftTypography fontSize="14px">Tanggal Awal</SoftTypography>
                    <TextField
                      type="date"
                      fullWidth
                      size="medium"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <SoftTypography fontSize="14px">Tanggal Akhir</SoftTypography>
                    <TextField
                      type="date"
                      fullWidth
                      size="medium"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
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

                  <Grid item xs={12} md={4} sx={{ display: "flex", justifyContent: "flex-end", mt: { xs: 2, md: 2 }, gap: 4 }}>
                    <Button variant="contained" color="success" onClick={generateLaporan}>
                      <AutorenewIcon sx={{ mr: 1 }} />
                      <SoftTypography fontSize="13px" color="black">Generate</SoftTypography>
                    </Button>

                    <Button variant="contained" color="error">
                      <PictureAsPdfIcon sx={{ mr: 1 }} />
                      <SoftTypography fontSize="13px" color="black">Export PDF</SoftTypography>
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
                  columns={columns}
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
                  <b>Laba Bersih:</b>{" "}
                  Rp{Math.abs(labaBersih).toLocaleString("id-ID")}
                  {labaBersih < 0}
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