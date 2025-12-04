import { useState } from "react";
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
import userTableData from "./data/user";

function UserManagement() {
  const { columns } = userTableData;

  const [data, setData] = useState(userTableData.rows);

  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);

  const indexOfLastRow = page * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [visiblePassword, setVisiblePassword] = useState({});

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

  const openEdit = (globalIndex) => {
    setForm(data[globalIndex]);
    setEditIndex(globalIndex);
    setOpen(true);
  };

  const save = () => {
    let newData = [...data];

    if (editIndex !== null) {
      newData[editIndex] = form;
    } else {
      newData.push(form);
      setPage(Math.ceil(newData.length / rowsPerPage));
    }

    setData(newData);
    setOpen(false);
  };

  const remove = (globalIndex) => {
    const newData = data.filter((_, i) => i !== globalIndex);
    setData(newData);
    setPage((prev) => {
      const maxPage = Math.ceil(newData.length / rowsPerPage);
      return prev > maxPage ? maxPage : prev;
    });
  };

  const tableRows = currentRows.map((row, index) => {
    const globalIndex = index + indexOfFirstRow;

    return {
      id: <SoftTypography variant="caption">{row.id}</SoftTypography>,
      username: <SoftTypography variant="caption">{row.username}</SoftTypography>,
      password: (
        <SoftBox
          display="flex"
          alignItems="center"
          justifyContent="center" 
          gap={1}
          width="100%"
        >
          <SoftTypography variant="caption">
            {visiblePassword[row.id] ? row.password : "•••••••"}
          </SoftTypography>

          <IconButton
            size="small"
            sx={{ padding: "2px" }}
            onClick={() =>
              setVisiblePassword((prev) => ({
                ...prev,
                [row.id]: !prev[row.id],
              }))
            }
          >
            <Icon sx={{ fontSize: "18px !important" }}>
              {visiblePassword[row.id] ? "visibility_off" : "visibility"}
            </Icon>
          </IconButton>
        </SoftBox>
      ),
      nama_lengkap: (
        <SoftTypography variant="caption">{row.nama_lengkap}</SoftTypography>
      ),
      email: <SoftTypography variant="caption">{row.email}</SoftTypography>,
      no_telp: <SoftTypography variant="caption">{row.no_telp}</SoftTypography>,
      role: <SoftTypography variant="caption">{row.role}</SoftTypography>,

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
          <IconButton
            color="info"
            size="small"
            onClick={() => openEdit(globalIndex)}
          >
            <EditIcon />
          </IconButton>

          <IconButton
            color="error"
            size="small"
            onClick={() => remove(globalIndex)}
          >
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
              <SoftBox
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                p={3}
              >
                <SoftTypography variant="h6">User Management</SoftTypography>

                <Button
                  variant="contained"
                  color="success"
                  onClick={openAdd}
                  sx={{ color: "inherit", minWidth: "150px" }}
                >
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
                <SoftBox
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  p={2}
                  gap={2}
                >
                  <Button
                    variant="outlined"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
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
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
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
            <SoftTypography variant="caption">Username</SoftTypography>
            <TextField
              fullWidth
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </Box>

          <Box display="flex" flexDirection="column" gap={1}>
            <SoftTypography variant="caption">Password</SoftTypography>

            <Box position="relative">
              <TextField
                fullWidth
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                size="small"
                InputProps={{
                  sx: {
                    height: "40px !important",
                    "& .MuiOutlinedInput-input": {
                      padding: "6px 30px 6px 8px",
                    },
                  },
                }}
              />
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                sx={{
                  position: "absolute",
                  right: "6px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  padding: "2px",
                  minWidth: 0,
                  minHeight: 0,
                }}
              >
                <Icon sx={{ fontSize: "18px !important" }}>
                  {showPassword ? "visibility_off" : "visibility"}
                </Icon>
              </IconButton>
            </Box>
          </Box>


          <Box display="flex" flexDirection="column" gap={1}>
            <SoftTypography variant="caption">Nama Lengkap</SoftTypography>
            <TextField
              fullWidth
              value={form.nama_lengkap}
              onChange={(e) => setForm({ ...form, nama_lengkap: e.target.value })}
            />
          </Box>

          <Box display="flex" flexDirection="column" gap={1}>
            <SoftTypography variant="caption">Email</SoftTypography>
            <TextField
              fullWidth
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Box>

          <Box display="flex" flexDirection="column" gap={1}>
            <SoftTypography variant="caption">No Telp</SoftTypography>
            <TextField
              fullWidth
              value={form.no_telp}
              onChange={(e) => setForm({ ...form, no_telp: e.target.value })}
            />
          </Box>

          <Box display="flex" flexDirection="column" gap={1}>
            <SoftTypography variant="caption">Role</SoftTypography>
            <TextField
              fullWidth
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            />
          </Box>

          <Box display="flex" flexDirection="column" gap={1}>
            <SoftTypography variant="caption">Status</SoftTypography>

            <Box display="flex" alignItems="center" gap={1}>
              <Switch
                checked={form.is_active}
                onChange={(e) =>
                  setForm({ ...form, is_active: e.target.checked })
                }
              />
              <SoftTypography variant="caption">
                {form.is_active ? "Aktif" : "Tidak Aktif"}
              </SoftTypography>
            </Box>
          </Box>

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
