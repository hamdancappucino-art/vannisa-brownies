import { useState, useEffect } from "react";
import axios from "axios";
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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Table from "examples/Tables/Table";

const API_URL = "http://localhost:5000/api/users";

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
  const [rowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [visiblePassword, setVisiblePassword] = useState({});
  const [submitted, setSubmitted] = useState(false); // state baru untuk validasi

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

  const indexOfLastRow = page * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

  // =================== FETCH USERS ===================
  const fetchUsers = async () => {
    try {
      const res = await axios.get(API_URL);
      const sorted = res.data.sort((a, b) => a.id - b.id);
      setData(sorted);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // =================== VALIDASI FIELD ===================
  const getFieldError = (fieldName) => {
    if (!submitted) return "";
    if (!form[fieldName] || form[fieldName].toString().trim() === "") {
      return "Field ini wajib diisi";
    }
    return "";
  };

  // =================== OPEN ADD ===================
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

  // =================== OPEN EDIT ===================
  const openEdit = (globalIndex) => {
    let userData = { ...data[globalIndex] };
    if (!userData.no_telp.startsWith("08")) userData.no_telp = "08" + userData.no_telp;
    setForm(userData);
    setEditIndex(globalIndex);
    setSubmitted(false);
    setOpen(true);
  };

  // =================== SAVE (ADD / EDIT) ===================
  const save = async () => {
    setSubmitted(true);

    // cek semua field wajib
    const emptyField = Object.keys(form).find(
      (key) => key !== "is_active" && (!form[key] || form[key].toString().trim() === "")
    );
    if (emptyField) return; // jika ada kosong, jangan lanjut

    try {
      if (editIndex !== null) {
        const id = data[editIndex].id;
        await axios.put(`${API_URL}/${id}`, form);
      } else {
        await axios.post(API_URL, form);
      }
      fetchUsers();
      setOpen(false);
    } catch (err) {
      console.error("Error saving user:", err);
    }
  };

  // =================== DELETE ===================
  const remove = async (globalIndex) => {
    try {
      const id = data[globalIndex].id;
      await axios.delete(`${API_URL}/${id}`);
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  // =================== TABLE ROWS ===================
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
            { label: "Role", key: "role", type: "text" },
          ].map((field) => (
            <Box key={field.key} display="flex" flexDirection="column" gap={1} position="relative">
              <SoftTypography variant="caption">{field.label}</SoftTypography>
              <TextField
                fullWidth
                type={field.key === "password" ? field.type : "text"}
                value={form[field.key]}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                error={!!getFieldError(field.key)}
                helperText={getFieldError(field.key)}
              />
              {field.key === "password" && (
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  sx={{ position: "absolute", right: "6px", top: "50%", transform: "translateY(-50%)", padding: "2px", minWidth: 0, minHeight: 0 }}
                >
                  <Icon sx={{ fontSize: "18px !important" }}>{showPassword ? "visibility_off" : "visibility"}</Icon>
                </IconButton>
              )}
            </Box>
          ))}

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
    </DashboardLayout>
  );
}

export default UserManagement;
