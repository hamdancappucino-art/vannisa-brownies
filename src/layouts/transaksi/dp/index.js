// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import TextField from "@mui/material/TextField";
import { Box, Modal } from "@mui/material";

import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import Table from "examples/Tables/Table";
import tableDataDownPayment from "./data/downpayment";
import { useState } from "react";

function TransaksiDP() {
  const { columns, rows: dpRows } = tableDataDownPayment;

  const [rows, setRows] = useState(dpRows);

  const [keyword, setKeyword] = useState("");

  const handleSearch = () => {
    console.log("Keyword:", keyword);

    const filtered = dpRows.filter(
      (r) =>
        r.nama_pelanggan.toLowerCase().includes(keyword.toLowerCase()) ||
        r.kode_transaksi.toLowerCase().includes(keyword.toLowerCase())
    );
    setRows(filtered);
  };

  const generateKodeRunning = () => {
    const numbers = rows
      .map(r => parseInt(r.kode_transaksi.replace("DP-", ""), 10))
      .filter(n => !isNaN(n));

    const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
    const nextNumber = String(maxNumber + 1).padStart(3, "0");

    return `DP-${nextNumber}`;
  };

  const [openAddModal, setOpenAddModal] = useState(false);

  const [newDP, setNewDP] = useState({
    nama_pelanggan: "",
    kode_transaksi: generateKodeRunning(),
    tanggal_dp: "",
    nominal_dp: "",
    status: "Belum Lunas",
  });

  const openAdd = () => setOpenAddModal(true);
  const closeAdd = () => setOpenAddModal(false);

  const handleAddSubmit = () => {
    const newRow = {
      no: rows.length + 1,
      ...newDP,
      aksi: "Detail",
    };

    setRows([...rows, newRow]);
    closeAdd();
  };

  const [openPelunasanModal, setOpenPelunasanModal] = useState(false);
  const [selectedDP, setSelectedDP] = useState(null);

  const openPelunasan = (data) => {
    setSelectedDP(data);
    setOpenPelunasanModal(true);
  };

  const closePelunasan = () => setOpenPelunasanModal(false);
  const [nominalPelunasan, setNominalPelunasan] = useState("");

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <SoftBox p={3}>
                <SoftTypography variant="h6" fontWeight="medium" mb={0}>
                  Transaksi Down Payment
                </SoftTypography>
                <Grid container spacing={2} mb={2} alignItems="flex-end" justifyContent="space-between">
                  <Grid item xs={12} md={8}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={8}>
                        <SoftTypography fontSize="14px" fontWeight="medium">
                          Cari Nama / Kode Transaksi
                        </SoftTypography>
                        <TextField
                          fullWidth
                          size="medium"
                          variant="outlined"
                          value={keyword}
                          onChange={(e) => setKeyword(e.target.value)}
                        />
                      </Grid>

                      <Grid item xs={12} md={1.5}>
                        <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          sx={{ mt: { xs: 4, md: 2.5 }, color: "inherit" }}
                          onClick={handleSearch}
                        >
                          <Icon sx={{ mr: 1, color: "white !important" }}>search</Icon>
                          <SoftTypography fontSize="13px" fontWeight="medium" color="white">
                            Cari
                          </SoftTypography>
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} md={"2.5"} display="flex" justifyContent="flex-end">
                    <Button
                      variant="contained"
                      color="success"
                      onClick={openAdd}
                      sx={{
                        color: "inherit",
                        minWidth: "150px",
                        mt: { xs: 4, md: 4 }
                      }}
                    >
                      <Icon sx={{ mr: 1, color: "black !important" }}>add</Icon>
                      <SoftTypography fontSize="13px" fontWeight="medium" color="black">
                        Tambah
                      </SoftTypography>
                    </Button>
                  </Grid>
                </Grid>
              </SoftBox>
              <SoftBox>
                <Card>
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
                      rows={rows.map((r) => ({
                        no: <SoftTypography variant="caption">{r.no}</SoftTypography>,
                        kode_transaksi: (
                          <SoftTypography variant="caption">{r.kode_transaksi}</SoftTypography>
                        ),
                        nama_pelanggan: (
                          <SoftTypography variant="caption">{r.nama_pelanggan}</SoftTypography>
                        ),
                        no_telp: (
                          <SoftTypography variant="caption">{r.no_telp}</SoftTypography>
                        ),
                        nominal_dp: (
                          <SoftTypography variant="caption">
                            {r.nominal_dp}
                          </SoftTypography>
                        ),
                        tanggal_dp: (
                          <SoftTypography variant="caption">{r.tanggal_dp}</SoftTypography>
                        ),
                        keterangan: (
                          <SoftTypography variant="caption">{r.keterangan}</SoftTypography>
                        ),
                        status: (
                          <SoftTypography variant="caption">{r.status}</SoftTypography>
                        ),
                        id_user: (
                          <SoftTypography variant="caption">{r.id_user}</SoftTypography>
                        ),
                        aksi: (
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{ textTransform: "none", borderRadius: "8px", fontSize: "12px" }}
                            onClick={() => openPelunasan(r)}
                          >
                            <SoftTypography variant="caption" color="info">Pelunasan</SoftTypography>
                          </Button>
                        ),
                      }))}
                    />
                  </SoftBox>
                </Card>
              </SoftBox>
            </Card>
          </Grid>
        </Grid>
      </SoftBox>
      <Footer />
      <Modal open={openAddModal} onClose={closeAdd} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Card
          sx={{
            width: 480,
            p: 3,
            bgcolor: "background.paper",
            borderRadius: 1,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <SoftTypography variant="h6" mb={2}>
            Tambah Down Payment
          </SoftTypography>
          <Box display="flex" flexDirection="column" gap={1}>
            <SoftTypography variant="caption" fontWeight="medium">
              Nama Pelanggan
            </SoftTypography>
            <TextField
              fullWidth
              variant="outlined"
              value={newDP.nama_pelanggan}
              onChange={(e) => setNewDP({ ...newDP, nama_pelanggan: e.target.value })}
            />
          </Box>
          <Box display="flex" flexDirection="column" gap={1}>
            <SoftTypography variant="caption" fontWeight="medium">
              Kode Transaksi
            </SoftTypography>
            <TextField
              fullWidth
              variant="outlined"
              value={newDP.kode_transaksi}
              InputProps={{ readOnly: true }}
              onChange={(e) => setNewDP({ ...newDP, kode_transaksi: e.target.value })}
            />
          </Box>
          <Box display="flex" flexDirection="column" gap={1}>
            <SoftTypography variant="caption" fontWeight="medium">
              Tanggal DP
            </SoftTypography>
            <TextField
              fullWidth
              type="date"
              variant="outlined"
              value={newDP.tanggal_dp}
              onChange={(e) => setNewDP({ ...newDP, tanggal_dp: e.target.value })}
            />
          </Box>
          <Box display="flex" flexDirection="column" gap={1}>
            <SoftTypography variant="caption" fontWeight="medium">
              Nominal DP
            </SoftTypography>
            <TextField
              fullWidth
              variant="outlined"
              value={newDP.nominal_dp}
              onChange={(e) => setNewDP({ ...newDP, nominal_dp: e.target.value })}
            />
          </Box>

          <Box mt={3} textAlign="right">
            <Button sx={{ color: "#FF0000 !important", mr: 2 }} onClick={closeAdd}>
              Batal
            </Button>
            <Button
              variant="contained"
              color="info"
              sx={{ color: "#0000FF !important" }}
              onClick={handleAddSubmit}
            >
              Simpan
            </Button>
          </Box>
        </Card>
      </Modal>
      <Modal open={openPelunasanModal} onClose={closePelunasan}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Card
          sx={{
            width: 480,
            p: 3,
            bgcolor: "background.paper",
            borderRadius: 1,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <SoftTypography variant="h6" mb={2}>
            Detail Pelunasan
          </SoftTypography>

          {selectedDP && (
            <>
              <Box display="flex" flexDirection="column" gap={1}>
                <SoftTypography variant="caption" fontWeight="medium">
                  Nama Pelanggan
                </SoftTypography>
                <SoftTypography>{selectedDP.nama_pelanggan}</SoftTypography>
              </Box>

              <Box display="flex" flexDirection="column" gap={1}>
                <SoftTypography variant="caption" fontWeight="medium">
                  Kode Transaksi
                </SoftTypography>
                <SoftTypography>{selectedDP.kode_transaksi}</SoftTypography>
              </Box>

              <Box display="flex" flexDirection="column" gap={1}>
                <SoftTypography variant="caption" fontWeight="medium">
                  Nominal DP
                </SoftTypography>
                <SoftTypography>{selectedDP.nominal_dp}</SoftTypography>
              </Box>

              {/* Input Pelunasan */}
              <Box display="flex" flexDirection="column" gap={1} mt={2}>
                <SoftTypography variant="caption" fontWeight="medium">
                  Sisa Pembayaran
                </SoftTypography>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Masukkan nominal"
                  value={nominalPelunasan}
                  onChange={(e) => setNominalPelunasan(e.target.value)}
                />
              </Box>

              <Box mt={3} textAlign="right">
                <Button sx={{ color: "#FF0000 !important", mr: 2 }} onClick={closePelunasan}>
                  Batal
                </Button>
                <Button variant="contained" color="success" onClick={() => console.log("Pelunasan OK")}>
                  Konfirmasi Pelunasan
                </Button>
              </Box>
            </>
          )}
        </Card>
      </Modal>
    </DashboardLayout>
  );
}

export default TransaksiDP;
