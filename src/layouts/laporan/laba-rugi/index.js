import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function LaporanLabaRugi() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={0} mx="auto">
            <Card>
              <SoftBox p={3}>
                <SoftTypography variant="h6" mb={2}>
                  Laporan Laba Rugi
                </SoftTypography>

                <SoftTypography variant="body2">
                  <b>Pendapatan:</b> Rp 12.000.000
                </SoftTypography>
                <SoftTypography variant="body2">
                  <b>Beban:</b> Rp 7.000.000
                </SoftTypography>
                <SoftTypography variant="body2" color="success" mt={1}>
                  <b>Laba Bersih:</b> Rp 5.000.000
                </SoftTypography>
              </SoftBox>
            </Card>
          </Grid>
        </Grid>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default LaporanLabaRugi;
