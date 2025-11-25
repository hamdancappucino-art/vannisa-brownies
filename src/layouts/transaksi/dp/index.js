// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import TextField from "@mui/material/TextField";

// Vannisa Brownies components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Layouts
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Table component (opsional, sementara dummy)
import DataTable from "examples/Tables/Table";

const columns = [
  { Header: "No", accessor: "no", width: "5%" },
  { Header: "Kode Transaksi", accessor: "kode" },
  { Header: "Nama Pembeli", accessor: "nama" },
  { Header: "Tanggal", accessor: "tanggal" },
  { Header: "Sisa Bayar", accessor: "sisa" },
  { Header: "Aksi", accessor: "aksi", width: "10%" },
];

const rows = [
  {
    no: 1,
    kode: "TRX001",
    nama: "Andi",
    tanggal: "2025-10-26",
    sisa: "Rp50.000",
    aksi: (
      <Button variant="contained" color="primary" size="small">
        Pelunasan
      </Button>
    ),
  },
];

function TransaksiDP() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <SoftBox p={3}>
                <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                  Daftar Transaksi Belum Lunas
                </SoftTypography>

                <Grid container spacing={2} mb={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Cari Nama / Kode Transaksi"
                      size="small"
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Button variant="contained" color="primary" fullWidth>
                      <Icon sx={{ mr: 1 }}>search</Icon>Cari
                    </Button>
                  </Grid>
                </Grid>

                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </SoftBox>
            </Card>
          </Grid>
        </Grid>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default TransaksiDP;
