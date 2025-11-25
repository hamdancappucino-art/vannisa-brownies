import { useState } from "react";

// @mui material components
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

// Vannisa Brownies components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Layouts
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Icons
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// Table Soft UI
import Table from "examples/Tables/Table";

// Data
import userTableData from "./data/user";

function UserManagement() {
  const { columns } = userTableData;

  // ================================
  // STATE DATA USER
  // ================================
  const [data, setData] = useState(userTableData.rows);

  // ================================
  // MODAL STATE
  // ================================
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ================================
  // OPEN ADD
  // ================================
  const openAdd = () => {
    setForm({
      id: data.length + 1,
      username: "",
      password: "",
      nama_lengkap: "",
      email: "",
      no_telp: "",
      role: "",
      is_active: true,
    });
    setEditIndex(null);
    setOpen(true);
  };

  // ================================
  // OPEN EDIT
  // ================================
  const openEdit = (index) => {
    setForm(data[index]);
    setEditIndex(index);
    setOpen(true);
  };

  // ================================
  // SAVE ADD/EDIT
  // ================================
  const save = () => {
    let newData = [...data];

    if (editIndex !== null) {
      newData[editIndex] = form; // update
    } else {
      newData.push(form); // add new
    }

    setData(newData);
    setOpen(false);
  };

  // ================================
  // REMOVE
  // ================================
  const remove = (index) => {
    const newData = data.filter((_, i) => i !== index);
    setData(newData);
  };

  // ================================
  // TABLE ROWS
  // ================================
  const tableRows = data.map((row, index) => ({
    id: <SoftTypography variant="caption" color="text">{row.id}</SoftTypography>,
    username: <SoftTypography variant="caption" color="text">{row.username}</SoftTypography>,
    password: <SoftTypography variant="caption" color="text">{row.password}</SoftTypography>,
    nama_lengkap: <SoftTypography variant="caption" color="text">{row.nama_lengkap}</SoftTypography>,
    email: <SoftTypography variant="caption" color="text">{row.email}</SoftTypography>,
    no_telp: <SoftTypography variant="caption" color="text">{row.no_telp}</SoftTypography>,
    role: <SoftTypography variant="caption" color="text">{row.role}</SoftTypography>,
    is_active: (
      <SoftTypography
        variant="caption"
        color={row.is_active ? "success" : "error"}
        fontWeight="medium"
      >
        {row.is_active ? "Aktif" : "Tidak Aktif"}
      </SoftTypography>
    ),

    aksi: (
      <SoftBox display="flex" gap={1} justifyContent="center">
        <IconButton color="info" size="small" onClick={() => openEdit(index)}>
          <EditIcon />
        </IconButton>
        <IconButton color="error" size="small" onClick={() => remove(index)}>
          <DeleteIcon />
        </IconButton>
      </SoftBox>
    ),
  }));

  // ================================
  // RENDER PAGE
  // ================================
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <SoftBox p={3}>
                <SoftTypography variant="h6" mb={2}>
                  User Management
                </SoftTypography>

                {/* HEADER */}
                <Grid container spacing={2} mb={2} justifyContent="flex-end">
                  <Button variant="contained" color="success" onClick={openAdd}>
                    <Icon sx={{ mr: 1 }}>add</Icon>
                    Tambah User
                  </Button>
                </Grid>

                {/* TABLE */}
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
                    <Table columns={columns} rows={tableRows} />
                  </SoftBox>
                </Card>
              </SoftBox>
            </Card>
          </Grid>
        </Grid>
      </SoftBox>

      <Footer />

      {/* =============================
           MODAL ADD / EDIT USER 
        ============================= */}
      <Modal open={open} onClose={() => setOpen(false)} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Box
          sx={{
            width: 450,
            bgcolor: "background.paper",
            p: 3,
            borderRadius: 1,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <SoftTypography variant="h6" mb={2}>
            {editIndex !== null ? "Edit User" : "Tambah User"}
          </SoftTypography>

          <Box display="flex" flexDirection="column" gap={1}>
            <SoftTypography variant="caption" fontWeight="medium">
              Username
            </SoftTypography>
            <TextField
              fullWidth
              variant="outlined"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </Box>

          <Box display="flex" flexDirection="column" gap={1}>
            <SoftTypography variant="caption" fontWeight="medium">
              Password
            </SoftTypography>
            <TextField
              fullWidth
              variant="outlined"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </Box>

          <Box display="flex" flexDirection="column" gap={1}>
            <SoftTypography variant="caption" fontWeight="medium">
              Nama Lengkap
            </SoftTypography>
            <TextField
              fullWidth
              variant="outlined"
              value={form.nama_lengkap}
              onChange={(e) => setForm({ ...form, nama_lengkap: e.target.value })}
            />
          </Box>

          <Box display="flex" flexDirection="column" gap={1}>
            <SoftTypography variant="caption" fontWeight="medium">
              Email
            </SoftTypography>
            <TextField
              fullWidth
              variant="outlined"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Box>

          <Box display="flex" flexDirection="column" gap={1}>
            <SoftTypography variant="caption" fontWeight="medium">
              No Telp
            </SoftTypography>
            <TextField
              fullWidth
              variant="outlined"
              value={form.no_telp}
              onChange={(e) => setForm({ ...form, no_telp: e.target.value })}
            />
          </Box>

          <Box display="flex" flexDirection="column" gap={1}>
            <SoftTypography variant="caption" fontWeight="medium">
              Role
            </SoftTypography>
            <TextField
              fullWidth
              variant="outlined"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            />
          </Box>

          <Box display="flex" flexDirection="column" gap={1}>
            <SoftTypography variant="caption" fontWeight="medium">
              Status
            </SoftTypography>

            <Box display="flex" alignItems="center" gap={1}>
              <Switch
                checked={form.is_active}
                onChange={(e) =>
                  setForm({ ...form, is_active: e.target.checked })
                }
              />

              <SoftTypography variant="caption" fontWeight="medium">
                {form.is_active ? "Aktif" : "Tidak Aktif"}
              </SoftTypography>
            </Box>
          </Box>

          {/* BUTTONS */}
          <Box mt={3} textAlign="right">
            <Button onClick={() => setOpen(false)} sx={{ mr: 2 }}>
              Batal
            </Button>
            <Button variant="contained" color="info" onClick={save}>
              Simpan
            </Button>
          </Box>
        </Box>
      </Modal>
    </DashboardLayout>
  );
}

export default UserManagement;
