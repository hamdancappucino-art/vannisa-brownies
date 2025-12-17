import { useState, useEffect } from "react";
import API from "api/api";
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
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import Table from "examples/Tables/Table";
import tableDataDownPayment from "./data/downpayment";

function TransaksiDP() {
  const { columns } = tableDataDownPayment;

  const [rows, setRows] = useState([]);
  const [rowsAsli, setRowsAsli] = useState([]);
  const [pelangganList, setPelangganList] = useState([]);
  const [produkList, setProdukList] = useState([]);
  const [keyword, setKeyword] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.username || "admin";

  // ================= FETCH =================
  const fetchDP = async () => {
    const res = await API.get("/dp");

    const sorted = res.data.sort(
      (a, b) => new Date(a.tanggal_dp) - new Date(b.tanggal_dp)
    );

    const data = sorted.map((item, index) => ({
      no: index + 1,
      ...item
    }));

    setRows(data);
    setRowsAsli(data);
  };

  const fetchPelanggan = async () => {
    const res = await API.get("/pelanggan");
    setPelangganList(res.data);
  };

  const fetchProduk = async () => {
    const res = await API.get("/produk");
    setProdukList(res.data);
  };

  useEffect(() => {
    fetchDP();
    fetchPelanggan();
    fetchProduk();
  }, []);

  // ================= SEARCH =================
  const handleSearch = () => {
    if (!keyword) return setRows(rowsAsli);

    const filtered = rowsAsli.filter(
      (r) =>
        r.nama_pelanggan?.toLowerCase().includes(keyword.toLowerCase()) ||
        r.kode_transaksi?.toLowerCase().includes(keyword.toLowerCase())
    );

    setRows(filtered);
  };

  // ================= ADD DP =================
  const [openAddModal, setOpenAddModal] = useState(false);
  const [newDP, setNewDP] = useState({
    id_pelanggan: "",
    id_produk: "",
    jumlah_barang: 1,
    harga_jual: "",
    tanggal_dp: "",
    nominal_dp: "",
    keterangan: "",
    no_telp: "",
  });

  const handleAddSubmit = async () => {
    if (!newDP.id_pelanggan || !newDP.nominal_dp || !newDP.id_produk || !newDP.tanggal_dp) {
      alert("Lengkapi data DP");
      return;
    }

    const totalHarga =
      Number(newDP.harga_jual) * Number(newDP.jumlah_barang);

    const minDP = totalHarga * 0.5;

    if (Number(newDP.nominal_dp) < minDP) {
      alert(`Minimal DP adalah ${formatRupiah(minDP)}`);
      return;
    }

    await API.post("/dp", {
      id_pelanggan: newDP.id_pelanggan,
      id_produk: newDP.id_produk,
      jumlah_barang: Number(newDP.jumlah_barang),
      tanggal_dp: newDP.tanggal_dp,
      nominal_dp: Number(newDP.nominal_dp),
      keterangan: newDP.keterangan || "-"
    });

    await fetchDP();
    setOpenAddModal(false);

    setNewDP({
      id_pelanggan: "",
      id_produk: "",
      jumlah_barang: "",
      tanggal_dp: "",
      nominal_dp: "",
      keterangan: "",
      no_telp: "",
    });
  };

  // ================= LUNASI =================
  const [openPelunasanModal, setOpenPelunasanModal] = useState(false);
  const [selectedDP, setSelectedDP] = useState(null);
  const [nominalPelunasan, setNominalPelunasan] = useState("");

  const handlePelunasanSubmit = async () => {
    if (!nominalPelunasan) {
      alert("Nominal pelunasan wajib diisi");
      return;
    }

    const totalPenjualan =
      Number(selectedDP.nominal_dp) + Number(nominalPelunasan);

    await API.post(`/dp/${selectedDP.id}/lunasi`, {
      tanggal: new Date().toISOString().slice(0, 10),
      nominal_pelunasan: Number(nominalPelunasan)
    });

    await fetchDP();
    setOpenPelunasanModal(false);
    setNominalPelunasan("");
  };

  // ================= FORMAT =================
  const formatRupiah = (value) => {
    if (value === null || value === undefined || value === "") return "Rp 0,00";

    return Number(value).toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

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
                      onClick={() => setOpenAddModal(true)}
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
                        nama_produk: (
                          <SoftTypography variant="caption">{r.nama_produk}</SoftTypography>
                        ),
                        jumlah_barang: (
                          <SoftTypography variant="caption">{r.jumlah_barang}</SoftTypography>
                        ),
                        nominal_dp: (
                          <SoftTypography variant="caption">
                            {formatRupiah(r.nominal_dp)}
                          </SoftTypography>
                        ),
                        tanggal_dp: (
                          <SoftTypography variant="caption">{formatDate(r.tanggal_dp)}</SoftTypography>
                        ),
                        keterangan: (
                          <SoftTypography variant="caption">{r.keterangan}</SoftTypography>
                        ),
                        status: (
                          <SoftTypography variant="caption">{r.status}</SoftTypography>
                        ),
                        // id_user: (
                        //   <SoftTypography variant="caption">{r.id_user}</SoftTypography>
                        // ),
                        aksi: r.status === "Belum Lunas" ? (
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => {
                              setSelectedDP(r);
                              setOpenPelunasanModal(true);
                            }}
                          >
                            <SoftTypography variant="caption" color="info">
                              Pelunasan
                            </SoftTypography>
                          </Button>
                        ) : (
                          <SoftTypography variant="caption" color="success">
                            Lunas
                          </SoftTypography>
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
      <Modal open={openAddModal} onClose={() => setOpenAddModal(false)} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
            <div style={{ position: "relative", marginTop: 0, }} >
              <select
                value={newDP.id_pelanggan}
                onChange={(e) => {
                  const selectedId = e.target.value;

                  const selectedPelanggan = pelangganList.find(
                    (p) => String(p.id_pelanggan) === String(selectedId)
                  );

                  setNewDP({
                    ...newDP,
                    id_pelanggan: selectedId,
                    no_telp: selectedPelanggan?.no_telp || "",
                  });
                }}
                onFocus={(e) => {
                  e.target.style.border = "1px solid #ccc";
                  e.target.style.outline = "none";
                }}
                onBlur={(e) => {
                  e.target.style.border = "1px solid #ccc";
                  e.target.style.outline = "none";
                }}
                style={{
                  width: "100%", height: "40px",
                  padding: "10px 40px 10px 14px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  appearance: "none",
                  backgroundColor: "white",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                <option value="" disabled>Pilih Pelanggan</option>
                {pelangganList.map((c) => (
                  <option key={c.id_pelanggan} value={c.id_pelanggan}>
                    {c.nama}
                  </option>
                ))}
              </select>
              <KeyboardArrowDownIcon
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  color: "black",
                }} />
            </div>
          </Box>
          <Box display="flex" flexDirection="column" gap={1}>
            <SoftTypography variant="caption" fontWeight="medium">
              No Telp
            </SoftTypography>
            <TextField
              fullWidth
              variant="outlined"
              value={newDP.no_telp}
              InputProps={{
                readOnly: true,
              }}
              sx={{
                "& .MuiOutlinedInput-input": {
                  maxWidth: "100% !important",
                  width: "100% !important",
                  minWidth: "100% !important",
                  flex: "1 1 auto !important",
                  display: "block !important",
                  overflow: "visible !important",
                  textOverflow: "clip !important",
                  whiteSpace: "normal !important",
                  color: "black !important"
                }
              }}
            />
          </Box>
          <Box display="flex" flexDirection="column" gap={1}>
            <SoftTypography variant="caption" fontWeight="medium">
              Nama Produk
            </SoftTypography>
            <div style={{ position: "relative", marginTop: 0, }} >
              <select
                value={newDP.id_produk}
                onChange={(e) => {
                  const selectedId = e.target.value;

                  const selectedPelanggan = produkList.find(
                    (p) => String(p.id_produk) === String(selectedId)
                  );

                  setNewDP({
                    ...newDP,
                    id_produk: selectedId,
                    harga_jual: selectedPelanggan?.harga_jual || "",
                  });
                }}
                onFocus={(e) => {
                  e.target.style.border = "1px solid #ccc";
                  e.target.style.outline = "none";
                }}
                onBlur={(e) => {
                  e.target.style.border = "1px solid #ccc";
                  e.target.style.outline = "none";
                }}
                style={{
                  width: "100%", height: "40px",
                  padding: "10px 40px 10px 14px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  appearance: "none",
                  backgroundColor: "white",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                <option value="" disabled>Pilih Produk</option>
                {produkList.map((p) => (
                  <option key={p.id_produk} value={p.id_produk}>
                    {p.nama_produk}
                  </option>
                ))}
              </select>
              <KeyboardArrowDownIcon
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  color: "black",
                }} />
            </div>
          </Box>
          <Box display="flex" flexDirection="column" gap={1}>
            <SoftTypography variant="caption" fontWeight="medium">
              Harga
            </SoftTypography>
            <TextField
              fullWidth
              variant="outlined"
              value={newDP.harga_jual}
              InputProps={{
                readOnly: true,
              }}
              sx={{
                "& .MuiOutlinedInput-input": {
                  maxWidth: "100% !important",
                  width: "100% !important",
                  minWidth: "100% !important",
                  flex: "1 1 auto !important",
                  display: "block !important",
                  overflow: "visible !important",
                  textOverflow: "clip !important",
                  whiteSpace: "normal !important",
                  color: "black !important"
                }
              }}
            />
          </Box>
          <Box display="flex" flexDirection="column" gap={1}>
            <SoftTypography variant="caption" fontWeight="medium">
              Jumlah Barang
            </SoftTypography>
            <TextField
              fullWidth
              variant="outlined"
              value={newDP.jumlah_barang}
              onChange={(e) =>
                setNewDP({
                  ...newDP,
                  jumlah_barang: Number(e.target.value)
                })
              }
              sx={{
                "& .MuiOutlinedInput-input": {
                  maxWidth: "100% !important",
                  width: "100% !important",
                  minWidth: "100% !important",
                  flex: "1 1 auto !important",
                  display: "block !important",
                  overflow: "visible !important",
                  textOverflow: "clip !important",
                  whiteSpace: "normal !important",
                  color: "black !important"
                }
              }}
            />
          </Box>
          <Box display="flex" flexDirection="column" gap={1}>
            <SoftTypography variant="caption" fontWeight="medium">
              Tanggal DP
            </SoftTypography>
            <div
              style={{
                position: "relative",
                marginTop: 0,
              }}
            >
              <input
                type="date"
                value={newDP.tanggal_dp}
                onChange={(e) =>
                  setNewDP({ ...newDP, tanggal_dp: e.target.value })
                }
                id="dateInput"
                onFocus={(e) => {
                  e.target.style.border = "1px solid #ccc";
                  e.target.style.outline = "none";
                }}
                onBlur={(e) => {
                  e.target.style.border = "1px solid #ccc";
                  e.target.style.outline = "none";
                }}
                style={{
                  width: "100%",
                  height: "40px",
                  padding: "10px 40px 10px 14px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  appearance: "none",
                  backgroundColor: "white",
                  fontSize: "14px",
                  cursor: "pointer",
                  position: "relative",
                  zIndex: 2,
                }}
              />
              <CalendarTodayIcon
                onClick={() => {
                  const input = document.getElementById("dateInput");
                  if (input?.showPicker) input.showPicker();
                }}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "black",
                  zIndex: 3,
                }}
              />
              <style>
                {`
                  input[type="date"]::-webkit-calendar-picker-indicator {
                    opacity: 0;
                    position: absolute;
                    right: 0;
                    width: 100%;
                    height: 100%;
                    cursor: pointer;
                  }
                `}
              </style>
            </div>
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
              sx={{
                "& .MuiOutlinedInput-input": {
                  maxWidth: "100% !important",
                  width: "100% !important",
                  minWidth: "100% !important",
                  flex: "1 1 auto !important",
                  display: "block !important",
                  overflow: "visible !important",
                  textOverflow: "clip !important",
                  whiteSpace: "normal !important",
                  color: "black !important"
                }
              }}
            />
          </Box>

          <Box display="flex" flexDirection="column" gap={1}>
            <SoftTypography variant="caption" fontWeight="medium">
              Keterangan
            </SoftTypography>
            <TextField
              fullWidth
              variant="outlined"
              value={newDP.keterangan}
              onChange={(e) =>
                setNewDP({ ...newDP, keterangan: e.target.value })
              }
              sx={{
                "& .MuiOutlinedInput-input": {
                  maxWidth: "100% !important",
                  width: "100% !important",
                  minWidth: "100% !important",
                  flex: "1 1 auto !important",
                  display: "block !important",
                  overflow: "visible !important",
                  textOverflow: "clip !important",
                  whiteSpace: "normal !important",
                  color: "black !important"
                }
              }}
            />
          </Box>

          <Box mt={3} textAlign="right">
            <Button sx={{ color: "#FF0000 !important", mr: 2 }} onClick={() => setOpenAddModal(false)}>
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
      <Modal open={openPelunasanModal} onClose={() => setOpenPelunasanModal(false)}
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
                  Produk
                </SoftTypography>
                <SoftTypography>
                  {selectedDP.nama_produk}
                </SoftTypography>
              </Box>

              <Box display="flex" flexDirection="column" gap={1}>
                <SoftTypography variant="caption" fontWeight="medium">
                  Harga Produk
                </SoftTypography>
                <SoftTypography>
                  {formatRupiah(selectedDP.harga_jual)}
                </SoftTypography>
              </Box>
              <Box display="flex" flexDirection="column" gap={1}>
                <SoftTypography variant="caption" fontWeight="medium">
                  Nominal DP
                </SoftTypography>
                <SoftTypography>{selectedDP.nominal_dp}</SoftTypography>
              </Box>
              <Box display="flex" flexDirection="column" gap={1}>
                <SoftTypography variant="caption" fontWeight="medium">
                  Keterangan
                </SoftTypography>
                <SoftTypography>
                  {selectedDP.keterangan || "-"}
                </SoftTypography>
              </Box>
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
                <Button sx={{ color: "#FF0000 !important", mr: 2 }} onClick={() => setOpenPelunasanModal(false)}>
                  Batal
                </Button>
                <Button variant="contained" color="success" onClick={handlePelunasanSubmit}>
                  <SoftTypography fontSize="13px" fontWeight="medium" color="black">
                    Konfirmasi Pelunasan
                  </SoftTypography>
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
