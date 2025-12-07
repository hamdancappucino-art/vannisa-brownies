// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

// Vannisa Brownies components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Layout
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function TransaksiInput() {
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

                  {/* ID Kasir */}
                  <Grid item xs={12} md={6}>
                    <SoftTypography variant="caption" fontWeight="medium">
                      ID Kasir
                    </SoftTypography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="medium"
                    />
                  </Grid>

                  {/* ID Produk */}
                  <Grid item xs={12} md={6}>
                    <SoftTypography variant="caption" fontWeight="medium">
                      ID Produk
                    </SoftTypography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="medium"
                    />
                  </Grid>

                  {/* ID Pelanggan */}
                  <Grid item xs={12} md={6}>
                    <SoftTypography variant="caption" fontWeight="medium">
                      ID Pelanggan
                    </SoftTypography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="medium"
                    />
                  </Grid>

                  {/* Tanggal Jual */}
                  <Grid item xs={12} md={6}>
                    <SoftTypography variant="caption" fontWeight="medium">
                      Tanggal Jual
                    </SoftTypography>
                    <TextField
                      fullWidth
                      type="date"
                      variant="outlined"
                      size="medium"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  {/* Jumlah */}
                  <Grid item xs={12} md={6}>
                    <SoftTypography variant="caption" fontWeight="medium">
                      Jumlah Barang
                    </SoftTypography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="medium"
                    />
                  </Grid>

                  {/* Harga Satuan */}
                  <Grid item xs={12} md={6}>
                    <SoftTypography variant="caption" fontWeight="medium">
                      Harga Satuan
                    </SoftTypography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="medium"
                    />
                  </Grid>

                  {/* Total Harga */}
                  <Grid item xs={12} md={6}>
                    <SoftTypography variant="caption" fontWeight="medium">
                      Total Harga
                    </SoftTypography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="medium"
                      placeholder="Auto / Manual"
                    />
                  </Grid>

                  {/* Metode Pembayaran */}
                  <Grid item xs={12} md={6}>
                    <SoftTypography variant="caption" fontWeight="medium">
                      Metode Pembayaran
                    </SoftTypography>
                    <TextField
                      select
                      fullWidth
                      variant="outlined"
                      size="medium"
                    >
                      <MenuItem value="cash">Cash</MenuItem>
                      <MenuItem value="transfer">Transfer</MenuItem>
                      <MenuItem value="qris">QRIS</MenuItem>
                    </TextField>
                  </Grid>

                  {/* Created At */}
                  <Grid item xs={12} md={6}>
                    <SoftTypography variant="caption" fontWeight="medium">
                      Created At
                    </SoftTypography>
                    <TextField
                      fullWidth
                      type="datetime-local"
                      variant="outlined"
                      size="medium"
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  {/* Buttons */}
                  <Grid item xs={12}>
                    <SoftBox display="flex" justifyContent="flex-end" gap={2}>
                      <Button
                        variant="outlined"
                        color="secondary"
                        sx={{ color: "error.main" }}
                      >
                        Batal
                      </Button>
                      <Button variant="contained" color="primary" sx={{ color: "white.main" }}>
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
    </DashboardLayout>
  );
}

export default TransaksiInput;
