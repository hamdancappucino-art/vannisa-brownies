import { useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import { Card, Icon, IconButton, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

// Vannisa Brownies components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Vannisa Brownies examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";

// Overview page components
import Header from "layouts/profile/components/Header";

function Overview() {
  const [edit, setEdit] = useState(false);

  const [form, setForm] = useState({
    username: "Boom",
    password: "boom123",
    nama: "Boom Boom",
    email: "boom@example.com",
    telp: "0897188281712",
    role: "Admin",
  });

  const handleChange = (key, val) => {
    setForm({ ...form, [key]: val });
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <DashboardLayout>
      <Header />
      <SoftBox mt={5} mb={3}>
        <Grid container spacing={0}>
          <Grid item xs={12} md={0} xl={0}>
            <Card sx={{ p: 3, borderRadius: "12px" }}>
              {/* Header */}
              <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <SoftTypography variant="h6" fontWeight="bold">
                  Informasi Profile
                </SoftTypography>

                <IconButton onClick={() => setEdit(!edit)}>
                  <EditIcon sx={{ color: edit ? "#1A73E8" : "inherit" }} />
                </IconButton>
              </SoftBox>

              {/* FORM */}
              <SoftBox mt={2}>
                <Grid container spacing={3}>

                  {/* KIRI */}
                  <Grid item xs={12} md={6}>
                    <SoftBox display="flex" flexDirection="column">

                      {/* USERNAME */}
                      <SoftTypography variant="caption" fontWeight="bold" sx={{ mb: "4px" }}>
                        Username
                      </SoftTypography>
                      <TextField
                        size="medium"
                        value={form.username}
                        disabled={!edit}
                        onChange={(e) => handleChange("username", e.target.value)}
                        sx={{ mb: 2 }} // <-- tambahkan margin bawah
                      />

                      {/* PASSWORD */}
                      <SoftTypography variant="caption" fontWeight="bold" sx={{ mb: "4px" }}>
                        Password
                      </SoftTypography>

                      <SoftBox
                        sx={{
                          position: "relative",
                          display: "flex",
                          alignItems: "center",
                          mb: 2,               // <-- tambahkan margin bawah di wrapper
                        }}
                      >
                        <TextField
                          fullWidth
                          size="medium"
                          type={showPassword ? "text" : "password"}
                          value={form.password}
                          disabled={!edit}
                          onChange={(e) => handleChange("password", e.target.value)}
                          sx={{
                            "& .MuiInputBase-root": {
                              paddingRight: "40px !important",
                            },
                          }}
                        />

                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          sx={{
                            position: "absolute",
                            right: "10px",
                            zIndex: 2,
                            padding: 0,
                          }}
                        >
                          <Icon sx={{ fontSize: "18px !important" }}>
                            {showPassword ? "visibility_off" : "visibility"}
                          </Icon>
                        </IconButton>
                      </SoftBox>

                      {/* NAMA LENGKAP */}
                      <SoftTypography variant="caption" fontWeight="bold" sx={{ mb: "4px" }}>
                        Nama Lengkap
                      </SoftTypography>
                      <TextField
                        size="medium"
                        value={form.nama}
                        disabled={!edit}
                        onChange={(e) => handleChange("nama", e.target.value)}
                        sx={{ mb: 2 }}
                      />

                    </SoftBox>
                  </Grid>

                  {/* KANAN */}
                  <Grid item xs={12} md={6}>
                    <SoftBox display="flex" flexDirection="column">
                      <SoftTypography variant="caption" fontWeight="bold" sx={{ mb: "4px" }}>
                        Email
                      </SoftTypography>
                      <TextField
                        sx={{ mb: 2 }}
                        size="medium"
                        value={form.email}
                        disabled={!edit}
                        onChange={(e) => handleChange("email", e.target.value)}
                      />

                      <SoftTypography variant="caption" fontWeight="bold" sx={{ mb: "4px" }}>
                        No Telp
                      </SoftTypography>
                      <TextField
                        sx={{ mb: 2 }}
                        size="medium"
                        value={form.telp}
                        disabled={!edit}
                        onChange={(e) => handleChange("telp", e.target.value)}
                      />

                      <SoftTypography variant="caption" fontWeight="bold" sx={{ mb: "4px" }}>
                        Role
                      </SoftTypography>
                      <TextField
                        sx={{ mb: 2 }}
                        size="medium"
                        value={form.role}
                        disabled={!edit}
                        onChange={(e) => handleChange("role", e.target.value)}
                      />
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

export default Overview;
