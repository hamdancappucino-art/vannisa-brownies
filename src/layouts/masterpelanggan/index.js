import { useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import {
  Card,
  Box,
  Button,
  Modal,
  TextField,
  Switch,
  IconButton,
} from "@mui/material";

import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import SoftTypography from "components/SoftTypography";
import SoftBox from "components/SoftBox";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Footer from "examples/Footer";

// Table Soft UI
import Table from "examples/Tables/Table";

// Data mentah pelanggan
import pelangganData from "./data/pelanggan";

function MasterPelanggan() {
  const { columns, rows: initialRows } = pelangganData;
  const [rows, setRows] = useState(initialRows);

  // Modal control
  const [open, setOpen] = useState(false);

  // Form data
  const [formData, setFormData] = useState({ nama: "", alamat: "", no_telp: "", email: "" });
  const [editIndex, setEditIndex] = useState(null);

  // Tambahkan kolom aksi
  const modifiedColumns = [...columns, { name: "aksi", align: "center" }];

  // Open Add Modal
  const openAdd = () => {
    setFormData({ nama: "", alamat: "", no_telp: "", email: "" });
    setEditIndex(null);
    setOpen(true);
  };

  // Open Edit Modal
  const openEdit = (index) => {
    setEditIndex(index);
    setFormData(rows[index]);
    setOpen(true);
  };

  const remove = (index) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus data ini?");
    if (confirmDelete) {
      setRows(rows.filter((_, i) => i !== index));
    }
  };

  // Save
  const save = () => {
    if (!formData.nama || !formData.alamat || !formData.no_telp) {
      alert("Semua field wajib diisi!");
      return;
    }

    if (editIndex !== null) {
      const updated = [...rows];
      updated[editIndex] = formData;
      setRows(updated);
    } else {
      setRows([
        ...rows,
        {
          id_pelanggan: rows.length + 1,
          created_at: "2025-01-01",
          ...formData,
        },
      ]);
    }

    setOpen(false);
  };

  // JSX untuk table
  const tableRows = rows.map((row, index) => ({
    id_pelanggan: (
      <SoftTypography variant="caption" color="text">
        {row.id_pelanggan}
      </SoftTypography>
    ),
    nama: (
      <SoftTypography variant="caption" color="text">
        {row.nama}
      </SoftTypography>
    ),
    alamat: (
      <SoftTypography variant="caption" color="text">
        {row.alamat}
      </SoftTypography>
    ),
    no_telp: (
      <SoftTypography variant="caption" color="text">
        {row.no_telp}
      </SoftTypography>
    ),
    email: (
      <SoftTypography variant="caption" color="text">
        {row.email}
      </SoftTypography>
    ),
    created_at: (
      <SoftTypography variant="caption" color="text">
        {row.created_at}
      </SoftTypography>
    ),
    aksi: (
      <SoftBox display="flex" alignItems="center" gap={1} justifyContent="center">
        <IconButton color="info" size="small" onClick={() => openEdit(index)}>
          <EditIcon />
        </IconButton>
        <IconButton color="error" size="small" onClick={() => remove(index)}>
          <DeleteIcon />
        </IconButton>
      </SoftBox>
    ),
  }));

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
                <SoftTypography variant="h6">Data Pelanggan</SoftTypography>
                <Grid item xs={12} md="auto">
                  <Button
                    variant="contained"
                    color="success"
                    onClick={openAdd}
                    sx={{ color: "inherit", minWidth: "150px" }}
                  >
                    <Icon sx={{ mr: 1, color: "black !important" }}>add</Icon>
                    <SoftTypography fontSize="13px" fontWeight="medium" color="black">
                      Tambah Pelanggan
                    </SoftTypography>
                  </Button>
                </Grid>
              </SoftBox>

              <SoftBox>
                <Table columns={modifiedColumns} rows={tableRows} />
              </SoftBox>
            </Card>
          </Grid>
        </Grid>
      </SoftBox>

      {/* MODAL INPUT */}
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
          <SoftTypography variant="h6">
            {editIndex !== null ? "Edit Pelanggan" : "Tambah Pelanggan"}
          </SoftTypography>

          <Box display="flex" flexDirection="column" gap={1}>
            <SoftTypography variant="caption" fontWeight="medium">
              Nama Pelanggan
            </SoftTypography>
            <TextField
              fullWidth
              variant="outlined"
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
            />
          </Box>

          <Box display="flex" flexDirection="column" gap={1}>
            <SoftTypography variant="caption" fontWeight="medium">
              Alamat
            </SoftTypography>
            <TextField
              fullWidth
              variant="outlined"
              value={formData.alamat}
              onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
            />
          </Box>

          <Box display="flex" flexDirection="column" gap={1}>
            <SoftTypography variant="caption" fontWeight="medium">
              Nomor Telepon
            </SoftTypography>
            <TextField
              fullWidth
              variant="outlined"
              value={formData.no_telp}
              onChange={(e) => setFormData({ ...formData, no_telp: e.target.value })}
            />
          </Box>

          <Box display="flex" flexDirection="column" gap={1}>
            <SoftTypography variant="caption" fontWeight="medium">
              Email
            </SoftTypography>
            <TextField
              fullWidth
              variant="outlined"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </Box>

          <Box mt={3} textAlign="right">
            <Button sx={{ color: "#FF0000 !important", mr: 2 }} onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button
              variant="contained"
              color="info"
              sx={{ color: "#0000FF !important" }}
              onClick={save}
            >
              Simpan
            </Button>
          </Box>
        </Box>
      </Modal>
      <Footer />
    </DashboardLayout>
  );
}

export default MasterPelanggan;
