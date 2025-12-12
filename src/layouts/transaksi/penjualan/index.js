import { useState, useEffect } from "react";
import API from "api/api";
import CustomDialog from "components/CustomDialog";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

// Vannisa Brownies components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Layout
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function TransaksiInput() {
  const [kasirList, setKasirList] = useState([]);
  const [produkList, setProdukList] = useState([]);
  const [pelangganList, setPelangganList] = useState([]);

  const [dialog, setDialog] = useState({
    open: false,
    title: "",
    subtitle: "",
    type: "success",
  });

  const showDialog = (title, subtitle = "", type = "success") => {
    setDialog({
      open: true,
      title,
      subtitle,
      type,
    });
  };

  const [form, setForm] = useState({
    id_kasir: "",
    id_produk: "",
    id_pelanggan: "",
    tanggal_jual: "",
    jumlah_barang: "",
    harga_satuan: "",
    total_harga: "",
    metode_pembayaran: "",
    stok: "",
  });

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    try {
      const kasir = await API.get("/users?role=kasir");
      const produk = await API.get("/produk");
      const pelanggan = await API.get("/pelanggan");

      setKasirList(kasir.data.filter(u => u.role === "kasir"));
      setProdukList(produk.data);
      setPelangganList(pelanggan.data);
    } catch (err) {
      console.error("Error load dropdown:", err);
    }
  };

  const handleSelectProduk = (id_produk) => {
    const selected = produkList.find((p) => p.id_produk === parseInt(id_produk));

    setForm((prev) => ({
      ...prev,
      id_produk,
      harga_satuan: selected ? selected.harga_jual : "",
      stok: selected ? selected.stok : "",
      total_harga:
        prev.jumlah_barang && selected
          ? prev.jumlah_barang * selected.harga_jual
          : "",
    }));
  };

  const handleJumlahChange = (jumlah) => {
    if (form.stok && jumlah > form.stok) {
      showDialog(
        "Stok Tidak Cukup!",
        `Stok tersedia hanya ${form.stok} pcs`,
        "warning"
      );
      return;
    }

    setForm((prev) => ({
      ...prev,
      jumlah_barang: jumlah,
      total_harga:
        jumlah && prev.harga_satuan ? jumlah * prev.harga_satuan : "",
    }));
  };

  const handleSubmit = async () => {
    try {
      await API.post("/transaksi-penjualan", form);
      showDialog("Transaksi Berhasil!", "Data transaksi telah disimpan", "success");
    } catch (err) {
      showDialog("Gagal Menyimpan!", "Periksa kembali input anda", "error");
    }
  };

  const handleReset = () => {
    setForm({
      id_kasir: "",
      id_produk: "",
      id_pelanggan: "",
      tanggal_jual: "",
      jumlah_barang: "",
      harga_satuan: "",
      total_harga: "",
      metode_pembayaran: "",
    });
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <SoftBox p={3}>
                <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                  Input Transaksi Penjualan
                </SoftTypography>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <SoftTypography variant="caption" fontWeight="medium">
                      ID Kasir
                    </SoftTypography>

                    <div style={{ position: "relative", marginTop: 0 }}>
                      <select
                        value={form.id_kasir}
                        onChange={(e) => setForm({ ...form, id_kasir: e.target.value })}
                        style={{
                          width: "100%",
                          height: "40px",
                          padding: "10px 40px 10px 14px",
                          borderRadius: "8px",
                          border: "1px solid #ccc",
                          appearance: "none",
                          backgroundColor: "white",
                          fontSize: "14px",
                          cursor: "pointer",
                        }}
                      >
                        <option value="" disabled>Pilih Kasir</option>

                        {kasirList.map((k) => (
                          <option key={k.id} value={k.id}>
                            {k.nama_lengkap}
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
                        }}
                      />
                    </div>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <SoftTypography variant="caption" fontWeight="medium">
                      ID Produk
                    </SoftTypography>

                    <div style={{ position: "relative", marginTop: 0 }}>
                      <select
                        value={form.id_produk}
                        onChange={(e) => handleSelectProduk(e.target.value)}
                        style={{
                          width: "100%",
                          height: "40px",
                          padding: "10px 40px 10px 14px",
                          borderRadius: "8px",
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
                        {form.stok && (
                          <SoftTypography fontSize="12px" color="info.main">
                            Stok tersedia: <b>{form.stok}</b>
                          </SoftTypography>
                        )}
                      </select>

                      <KeyboardArrowDownIcon
                        style={{
                          position: "absolute",
                          right: "12px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          pointerEvents: "none",
                          color: "black",
                        }}
                      />
                    </div>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <SoftTypography variant="caption" fontWeight="medium">
                      ID Pelanggan
                    </SoftTypography>

                    <div style={{ position: "relative", marginTop: 0 }}>
                      <select
                        value={form.id_pelanggan}
                        onChange={(e) => setForm({ ...form, id_pelanggan: e.target.value })}
                        style={{
                          width: "100%",
                          height: "40px",
                          padding: "10px 40px 10px 14px",
                          borderRadius: "8px",
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
                        }}
                      />
                    </div>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <SoftTypography variant="caption" fontWeight="medium">
                      Tanggal Jual
                    </SoftTypography>
                    <div
                      style={{
                        position: "relative",
                        marginTop: 0,
                      }}
                    >
                      <input
                        type="date"
                        value={form.tanggal_jual}
                        onChange={(e) =>
                          setForm({ ...form, tanggal_jual: e.target.value })
                        }
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
                          borderRadius: "8px",
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
                          const input = document.getElementById("tanggal_jual");
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
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <SoftTypography variant="caption" fontWeight="medium">
                      Jumlah Barang
                    </SoftTypography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="medium"
                      value={form.jumlah_barang}
                      onChange={(e) => handleJumlahChange(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <SoftTypography variant="caption" fontWeight="medium">
                      Harga Satuan
                    </SoftTypography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="medium"
                      value={form.harga_satuan}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <SoftTypography variant="caption" fontWeight="medium">
                      Total Harga
                    </SoftTypography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="medium"
                      value={form.total_harga}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>

                  {/* Metode Pembayaran */}
                  <Grid item xs={12} md={6}>
                    <SoftTypography variant="caption" fontWeight="medium">
                      Metode Pembayaran
                    </SoftTypography>

                    <div style={{ position: "relative", marginTop: 0 }}>
                      <select
                        id="metodePembayaranInput"
                        value={form.metode_pembayaran}
                        onChange={(e) => setForm({ ...form, metode_pembayaran: e.target.value })}
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
                          borderRadius: "8px",
                          border: "1px solid #ccc",
                          appearance: "none",
                          backgroundColor: "white",
                          fontSize: "14px",
                          cursor: "pointer",
                        }}
                      >
                        <option value="" disabled>
                          Pilih Metode Pembayaran
                        </option>
                        <option value="cash">Cash</option>
                        <option value="transfer">Transfer</option>
                        <option value="qris">QRIS</option>
                      </select>

                      <KeyboardArrowDownIcon
                        style={{
                          position: "absolute",
                          right: "12px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          pointerEvents: "none",
                          color: "black",
                        }}
                      />
                    </div>
                  </Grid>

                  {/* Buttons */}
                  <Grid item xs={12}>
                    <SoftBox display="flex" justifyContent="flex-end" gap={2}>
                      <Button
                        variant="outlined"
                        color="secondary"
                        sx={{ color: "error.main" }}
                        onClick={handleReset}
                      >
                        Batal
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ color: "white.main" }}
                        onClick={handleSubmit}
                        disabled={
                          !form.id_produk ||
                          !form.jumlah_barang ||
                          form.jumlah_barang > form.stok
                        }
                      >
                        Simpan
                      </Button>
                    </SoftBox>
                  </Grid>

                </Grid>
              </SoftBox>
            </Card>
          </Grid>
        </Grid>
      </SoftBox>

      <Footer />
      <CustomDialog
        open={dialog.open}
        onClose={() => setDialog({ ...dialog, open: false })}
        title={dialog.title}
        subtitle={dialog.subtitle}
        type={dialog.type}
      />
    </DashboardLayout>
  );
}

export default TransaksiInput;
