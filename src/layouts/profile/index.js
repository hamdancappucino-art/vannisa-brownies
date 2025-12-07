import { useState, useEffect } from "react";
import axios from "axios";

// MUI
import Grid from "@mui/material/Grid";
import { Card, Icon, IconButton, TextField, Box, Button, } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

// Components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import Header from "layouts/profile/components/Header";

const API_URL = "http://localhost:5000/api/users";

function Overview() {
  const [edit, setEdit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [originalData, setOriginalData] = useState({});

  const [form, setForm] = useState({
    username: "",
    password: "",
    nama: "",
    email: "",
    telp: "",
    role: "",
  });

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user") || "{}");

    if (!u.id) {
      console.error("User ID tidak ditemukan di localStorage");
      return;
    }

    axios
      .get(`${API_URL}/${u.id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        }
      })
      .then((res) => {
        const user = res.data;

        const data = {
          username: user.username,
          password: user.password,
          nama: user.nama_lengkap,
          email: user.email,
          telp: user.no_telp,
          role: user.role,
        };

        setForm(data);
        setOriginalData(data);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
      });
  }, []);

  const handleSave = async () => {
    setLoading(true);

    try {
      await axios.put(`${API_URL}/1`, {
        username: form.username,
        password: form.password ? form.password : undefined,
        nama_lengkap: form.nama,
        email: form.email,
        no_telp: form.telp,
        role: form.role,
        is_active: 1,
      });

      alert("Profil berhasil diperbarui!");

      setOriginalData(form);
      setEdit(false);
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Gagal memperbarui data.");
    }

    setLoading(false);
  };

  const handleCancel = () => {
    setForm(originalData);
    setEdit(false);
  };



  const handleChange = (key, val) => {
    setForm({ ...form, [key]: val });
  };

  return (
    <DashboardLayout>
      <Header nama={form.nama} role={form.role} />

      <SoftBox mt={5} mb={3}>
        <Grid container spacing={0}>
          <Grid item xs={12}>
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
                        sx={{ mb: 2 }}
                      />

                      {/* PASSWORD */}
                      <SoftTypography variant="caption" fontWeight="bold" sx={{ mb: "4px" }}>
                        Password
                      </SoftTypography>

                      <SoftBox sx={{ position: "relative", mb: 2, display: "flex", alignItems: "center" }}>
                        <TextField
                          fullWidth
                          size="medium"
                          type={showPassword ? "text" : "password"}
                          value={form.password}
                          disabled={!edit}
                          onChange={(e) => handleChange("password", e.target.value)}
                          // placeholder="Isi untuk mengganti password"
                          sx={{ "& .MuiInputBase-root": { paddingRight: "40px !important" } }}
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

                      {/* NAMA */}
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
                        size="medium"
                        value={form.email}
                        disabled={!edit}
                        onChange={(e) => handleChange("email", e.target.value)}
                        sx={{ mb: 2 }}
                      />

                      <SoftTypography variant="caption" fontWeight="bold" sx={{ mb: "4px" }}>
                        No Telp
                      </SoftTypography>
                      <TextField
                        size="medium"
                        value={form.telp}
                        disabled={!edit}
                        onChange={(e) => handleChange("telp", e.target.value)}
                        sx={{ mb: 2 }}
                      />

                      <SoftTypography variant="caption" fontWeight="bold" sx={{ mb: "4px" }}>
                        Role
                      </SoftTypography>
                      <TextField
                        size="medium"
                        value={form.role}
                        disabled={!edit}
                        onChange={(e) => handleChange("role", e.target.value)}
                        sx={{ mb: 2 }}
                      />
                    </SoftBox>
                  </Grid>

                </Grid>
                {edit && (
                  <Box mt={3} textAlign="right">
                    <Button
                      sx={{ color: "#FF0000 !important", mr: 2 }}
                      onClick={handleCancel}
                    >
                      Batal
                    </Button>
                    <Button
                      variant="contained"
                      color="info"
                      sx={{ color: "#0000FF !important" }}
                      onClick={handleSave}
                    >
                      Simpan
                    </Button>
                  </Box>
                )}
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
