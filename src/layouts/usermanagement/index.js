import { useState, useEffect } from "react";
import API from "api/api";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import {
  Card,
  Box,
  Button,
  Modal,
  TextField,
  IconButton,
  Switch,
} from "@mui/material";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import CustomDialog from "components/CustomDialog";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Table from "examples/Tables/Table";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const columns = [
  { name: "id", label: "No", align: "center" },
  { name: "username", label: "Username", align: "center" },
  { name: "password", label: "Password", align: "center" },
  { name: "nama_lengkap", label: "Nama Lengkap", align: "center" },
  { name: "email", label: "Email", align: "center" },
  { name: "no_telp", label: "No Telp", align: "center" },
  { name: "role", label: "Role", align: "center" },
  { name: "is_active", label: "Status", align: "center" },
  { name: "aksi", label: "Aksi", align: "center" },
];

function UserManagement() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [visiblePassword, setVisiblePassword] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    id: "",
    username: "",
    password: "",
    nama_lengkap: "",
    email: "",
    no_telp: "",
    role: "",
    is_active: true,
  });

  const [dialog, setDialog] = useState({
    open: false,
    title: "",
    subtitle: "",
    type: "success",
  });

  const showDialog = ({ title, subtitle = "", type = "success" }) => {
    setDialog({
      open: true,
      title,
      subtitle,
      type,
    });
  };

  const indexOfLastRow = page * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      const sorted = res.data.sort((a, b) => a.id - b.id);
      setData(sorted);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const validatePassword = (password) => {
    if (!password || password.trim() === "") return "Field ini wajib diisi";

    if (password.length < 8) return "Password minimal 8 karakter";
    if (password.length > 12) return "Password maksimal 12 karakter";

    if (!/[A-Z]/.test(password)) return "Harus mengandung 1 huruf kapital (A-Z)";
    if (!/[0-9]/.test(password)) return "Harus mengandung angka (0-9)";
    if (!/[^A-Za-z0-9]/.test(password)) return "Harus mengandung simbol";

    return "";
  };

  const getFieldError = (fieldName) => {
    if (!submitted) return "";

    if (fieldName === "password") {
      return validatePassword(form.password);
    }

    if (!form[fieldName] || form[fieldName].toString().trim() === "") {
      return "Field ini wajib diisi";
    }
    return "";
  };

  const openAdd = () => {
    setForm({
      id: "",
      username: "",
      password: "",
      nama_lengkap: "",
      email: "",
      no_telp: "08",
      role: "",
      is_active: true,
    });
    setEditIndex(null);
    setSubmitted(false);
    setOpen(true);
  };

  const openEdit = (globalIndex) => {
    let userData = { ...data[globalIndex] };
    if (!userData.no_telp.startsWith("08")) userData.no_telp = "08" + userData.no_telp;
    setForm(userData);
    setEditIndex(globalIndex);
    setSubmitted(false);
    setOpen(true);
  };

  const save = async () => {
    setSubmitted(true);

    const requiredFields = ["username", "password", "nama_lengkap", "email", "no_telp", "role"];
    const emptyField = requiredFields.find(
      (key) => !form[key] || form[key].toString().trim() === ""
    );
    if (emptyField) return;

    const pwdError = validatePassword(form.password);
    if (pwdError) return;

    // ✅ PAYLOAD DIDEFINISIKAN
    const payload = {
      username: form.username,
      password: form.password,
      nama_lengkap: form.nama_lengkap,
      email: form.email,
      no_telp: form.no_telp,
      role: form.role,
      is_active: form.is_active ? 1 : 0,
    };

    try {
      // ✅ DETEKSI EDIT / ADD
      if (editIndex !== null) {
        const id = data[editIndex].id;
        await API.put(`/users/${id}`, payload);

        showDialog({
          title: "Berhasil",
          subtitle: "Data user berhasil diperbarui",
          type: "success",
        });
      } else {
        await API.post("/users", payload);

        showDialog({
          title: "Berhasil",
          subtitle: "User baru berhasil ditambahkan",
          type: "success",
        });
      }

      fetchUsers();
      setOpen(false);
    } catch (err) {
      console.error("SAVE ERROR:", err);

      showDialog({
        title: "Gagal",
        subtitle: "Terjadi kesalahan saat menyimpan data",
        type: "error",
      });
    }
  };

  const remove = async (globalIndex) => {
    try {
      const id = data[globalIndex].id;
      await API.delete(`/users/${id}`);

      fetchUsers();

      showDialog({
        title: "Berhasil",
        subtitle: "User berhasil dihapus",
        type: "success",
      });
    } catch (err) {
      showDialog({
        title: "Gagal",
        subtitle: "Tidak dapat menghapus user",
        type: "error",
      });
    }
  };

  const tableRows = currentRows.map((row, index) => {
    const globalIndex = index + indexOfFirstRow;
    const displayRole = row.role.replace(/_/g, " ");
    const displayNoTelp = row.no_telp.startsWith("08") ? row.no_telp : "08" + row.no_telp;

    return {
      id: <SoftTypography variant="caption">{row.id}</SoftTypography>,
      username: <SoftTypography variant="caption">{row.username}</SoftTypography>,
      password: (
        <SoftBox display="flex" alignItems="center" justifyContent="center" gap={1} width="100%">
          <SoftTypography variant="caption">
            {visiblePassword[row.id] ? row.password : "•••••••"}
          </SoftTypography>
          <IconButton
            size="small"
            sx={{ padding: "2px" }}
            onClick={() =>
              setVisiblePassword((prev) => ({ ...prev, [row.id]: !prev[row.id] }))
            }
          >
            <Icon sx={{ fontSize: "18px !important" }}>
              {visiblePassword[row.id] ? "visibility_off" : "visibility"}
            </Icon>
          </IconButton>
        </SoftBox>
      ),
      nama_lengkap: <SoftTypography variant="caption">{row.nama_lengkap}</SoftTypography>,
      email: <SoftTypography variant="caption">{row.email}</SoftTypography>,
      no_telp: <SoftTypography variant="caption">{displayNoTelp}</SoftTypography>,
      role: <SoftTypography variant="caption">{displayRole}</SoftTypography>,
      is_active: (
        <SoftTypography variant="caption" color={row.is_active ? "success" : "error"} fontWeight="medium">
          {row.is_active ? "Aktif" : "Tidak Aktif"}
        </SoftTypography>
      ),
      aksi: (
        <SoftBox display="flex" gap={1} justifyContent="center">
          <IconButton color="info" size="small" onClick={() => openEdit(globalIndex)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" size="small" onClick={() => remove(globalIndex)}>
            <DeleteIcon />
          </IconButton>
        </SoftBox>
      ),
    };
  });

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
                <SoftTypography variant="h6">User Management</SoftTypography>
                <Button variant="contained" color="success" onClick={openAdd} sx={{ color: "inherit", minWidth: "150px" }}>
                  <Icon sx={{ mr: 1, color: "black !important" }}>add</Icon>
                  <SoftTypography fontSize="13px" fontWeight="medium" color="black">
                    Tambah User
                  </SoftTypography>
                </Button>
              </SoftBox>

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
                <Table columns={columns} rows={tableRows} />
                <SoftBox display="flex" justifyContent="center" alignItems="center" p={2} gap={2}>
                  <Button variant="outlined" disabled={page === 1} onClick={() => setPage(page - 1)}>
                    <SoftTypography fontSize="13px" fontWeight="medium" color="black">
                      Previous
                    </SoftTypography>
                  </Button>

                  <SoftTypography variant="caption">
                    Page {page} of {Math.ceil(data.length / rowsPerPage)}
                  </SoftTypography>

                  <Button
                    variant="outlined"
                    disabled={page === Math.ceil(data.length / rowsPerPage)}
                    onClick={() => setPage(page + 1)}
                  >
                    <SoftTypography fontSize="13px" fontWeight="medium" color="black">
                      Next
                    </SoftTypography>
                  </Button>
                </SoftBox>
              </SoftBox>
            </Card>
          </Grid>
        </Grid>
      </SoftBox>

      <Footer />

      {/* MODAL ADD / EDIT */}
      <Modal open={open} onClose={() => setOpen(false)} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Box sx={{ width: 450, bgcolor: "background.paper", p: 3, borderRadius: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          <SoftTypography variant="h6" mb={2}>
            {editIndex !== null ? "Edit User" : "Tambah User"}
          </SoftTypography>

          {/* Semua field dengan helperText hanya muncul setelah tombol simpan */}
          {[
            { label: "Username", key: "username", type: "text" },
            { label: "Password", key: "password", type: showPassword ? "text" : "password" },
            { label: "Nama Lengkap", key: "nama_lengkap", type: "text" },
            { label: "Email", key: "email", type: "text" },
            { label: "No Telp", key: "no_telp", type: "text" },
          ].map((field) => (
            <Box key={field.key} display="flex" flexDirection="column" gap={1}>
              <SoftTypography variant="caption">{field.label}</SoftTypography>

              <TextField
                fullWidth
                type={field.type}
                value={form[field.key]}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                error={!!getFieldError(field.key)}
                helperText={getFieldError(field.key)}
                InputProps={{
                  sx: {
                    "& .MuiInputBase-input": {
                      paddingRight: "40px !important",
                    },
                    position: "relative",
                  },
                  endAdornment:
                    field.key === "password" ? (
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        sx={{
                          position: "absolute",
                          right: 8,
                          top: "50%",
                          transform: "translateY(-50%)",
                        }}
                      >
                        <Icon sx={{ fontSize: "18px !important" }}>{showPassword ? "visibility_off" : "visibility"}</Icon>
                      </IconButton>
                    ) : null,
                }}
              />
            </Box>
          ))}
          <Box mb={2}>
            <SoftTypography variant="caption" fontWeight="medium">
              Role
            </SoftTypography>

            <div
              style={{
                position: "relative",
                marginTop: 6,
              }}
            >
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
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
                  height: "45px",
                  padding: "10px 40px 10px 14px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  appearance: "none",
                  backgroundColor: "white",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                <option value="" disabled>Pilih role</option>
                <option value="admin">Admin</option>
                <option value="staff_keuangan">Staff Keuangan</option>
                <option value="kasir">Kasir</option>
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

            {/* ERROR ROLE */}
            {submitted && !form.role && (
              <SoftTypography variant="caption" color="error">
                Field ini wajib diisi
              </SoftTypography>
            )}
          </Box>

          <Box display="flex" flexDirection="column" gap={1}>
            <SoftTypography variant="caption">Status</SoftTypography>
            <Box display="flex" alignItems="center" gap={1}>
              <Switch checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
              <SoftTypography variant="caption">{form.is_active ? "Aktif" : "Tidak Aktif"}</SoftTypography>
            </Box>
          </Box>

          <Box mt={3} textAlign="right">
            <Button onClick={() => setOpen(false)} sx={{ mr: 2 }}>Batal</Button>
            <Button variant="contained" color="info" onClick={save}>Simpan</Button>
          </Box>
        </Box>
      </Modal>
      <CustomDialog
        open={dialog.open}
        title={dialog.title}
        subtitle={dialog.subtitle}
        type={dialog.type}
        onClose={() => setDialog({ ...dialog, open: false })}
      />
    </DashboardLayout>
  );
}

export default UserManagement;
