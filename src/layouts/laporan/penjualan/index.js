import React, { useState, useEffect } from "react";
import API from "api/api";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import TextField from "@mui/material/TextField";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";

import laporanPenjualanTableData from "./data/penjualan";

export default function LaporanPenjualan() {
  const { columns } = laporanPenjualanTableData;

  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // FETCH DATA DARI API
  async function fetchData() {
    try {
      let url = "/laporan-penjualan";
      if (startDate && endDate) {
        url += `?start=${startDate}&end=${endDate}`;
      }

      const res = await API.get(url);
      console.log("HASIL LAPORAN:", res.data);
      setData(res.data.data || []);
    } catch (e) {
      console.error(e);
      alert("Gagal mengambil data laporan");
    }
  }

  // GENERATE LAPORAN
  async function generateLaporan() {
    try {
      let url = "/laporan-penjualan/generate";
      if (startDate && endDate) {
        url += `?start=${startDate}&end=${endDate}`;
      }
      await API.get(url);       // hit API generate
      await fetchData();        // refresh data setelah generate
      alert("Laporan berhasil digenerate!");
    } catch (e) {
      console.error(e);
      alert("Gagal generate laporan");
    }
  }

  // EXPORT PDF
  async function exportPDF() {
    if (!startDate || !endDate) return alert("Isi tanggal dulu!");

    try {
      const res = await API.get(
        `/laporan-penjualan/export?start=${startDate}&end=${endDate}`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `laporan-penjualan-${startDate}-${endDate}.pdf`;
      a.click();
    } catch (e) {
      console.error(e);
      alert("Gagal export PDF");
    }
  }

  // FORMAT TANGGAL
  function formatDate(dateString) {
    if (!dateString) return "";
    if (dateString.includes("T")) return dateString.split("T")[0];
    if (dateString.includes(" ")) return dateString.split(" ")[0];
    return dateString;
  }

  // FETCH DATA SAAT HALAMAN LOAD
  useEffect(() => {
    fetchData();
  }, []);

  const sortedData = [...data].sort(
    (a, b) => a.id_laporan - b.id_laporan
  );

  // BUILD TABLE ROWS
  const tableRows = sortedData.map((row) => ({
    id_laporan: <SoftTypography variant="caption">{row.id_laporan}</SoftTypography>,
    tanggal_awal: <SoftTypography variant="caption">{formatDate(row.tanggal_awal)}</SoftTypography>,
    tanggal_akhir: <SoftTypography variant="caption">{formatDate(row.tanggal_akhir)}</SoftTypography>,
    total_penjualan: <SoftTypography variant="caption">Rp{Number(row.total_penjualan).toLocaleString("id-ID")}</SoftTypography>,
    total_transaksi: <SoftTypography variant="caption">{row.total_transaksi}</SoftTypography>,
    produk_terlaris: <SoftTypography variant="caption">{row.produk_terlaris}</SoftTypography>,
    periode: <SoftTypography variant="caption">{row.periode}</SoftTypography>,
    created_at: <SoftTypography variant="caption">{formatDate(row.created_at)}</SoftTypography>,
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
                <SoftTypography variant="h6">Laporan Penjualan</SoftTypography>

                <Grid container spacing={2} mb={2} alignItems="flex-end">
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
                      sx={{ mt: { xs: 4, md: 4 } }}
                      onClick={fetchData}
                    >
                      <Icon sx={{ mr: 1, color: "white !important" }}>search</Icon>
                      <SoftTypography fontSize="13px" color="white">Tampilkan</SoftTypography>
                    </Button>
                  </Grid>

                  <Grid item xs={12} md={4} sx={{ display: "flex", justifyContent: "flex-end", mt: { xs: 2, md: 4 }, gap: 4 }}>
                    <Button variant="contained" color="success" onClick={generateLaporan}>
                      <AutorenewIcon sx={{ mr: 1 }} />
                      <SoftTypography fontSize="13px" color="black">Generate</SoftTypography>
                    </Button>

                    <Button variant="contained" color="error" onClick={exportPDF}>
                      <PictureAsPdfIcon sx={{ mr: 1 }} />
                      <SoftTypography fontSize="13px" color="black">Export PDF</SoftTypography>
                    </Button>
                  </Grid>
                </Grid>
              </SoftBox>

              {/* TABLE */}
              <SoftBox sx={{ "& .MuiTableRow-root td": { borderBottom: "1px solid #eee" } }}>
                <Table columns={columns} rows={tableRows} />
              </SoftBox>
            </Card>
          </Grid>
        </Grid>
      </SoftBox>

      <Footer />
    </DashboardLayout>
  );
}
