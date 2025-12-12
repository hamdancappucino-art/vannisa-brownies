import { useState, useEffect } from "react";
import API from "api/api";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import {
  Card,
  Box,
  Button,
  Modal,
  TextField,
  IconButton,
} from "@mui/material";

import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import SoftTypography from "components/SoftTypography";
import SoftBox from "components/SoftBox";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Table from "examples/Tables/Table";
import Footer from "examples/Footer";

function MasterPelanggan() {
  const [rows, setRows] = useState([]);

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);

  const indexOfLastRow = page * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = rows.slice(indexOfFirstRow, indexOfLastRow);

  const [formData, setFormData] = useState({
    nama: "",
    alamat: "",
    no_telp: "",
    email: "",
  });

  const columns = [
    { name: "id_pelanggan", label: "No", align: "center" },
    { name: "nama", label: "Nama Pelanggan", align: "center" },
    { name: "alamat", label: "Alamat", align: "center" },
    { name: "no_telp", label: "No. Telp", align: "center" },
    { name: "email", label: "Email", align: "center" },
    { name: "tanggal", label: "Tanggal", align: "center" },
    { name: "aksi", label: "Aksi", align: "center" },
  ];

  const fetchData = async () => {
    try {
      const res = await API.get("/pelanggan");

      // DETEKSI otomatis apakah datanya array atau object.data
      const result = Array.isArray(res.data) ? res.data : res.data.data;

      setRows(result || []);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAdd = () => {
    setEditId(null);
    setFormData({ nama: "", alamat: "", no_telp: "", email: "" });
    setOpen(true);
  };

  const openEdit = (row) => {
    setEditId(row.id_pelanggan);
    setFormData({
      nama: row.nama,
      alamat: row.alamat,
      no_telp: row.no_telp,
      email: row.email,
    });
    setOpen(true);
  };

  const remove = async (id) => {
    const conf = window.confirm("Yakin ingin menghapus?");
    if (!conf) return;

    try {
      await API.delete(`/pelanggan/${id}`);
      fetchData(); // 🔥 pakai fetchData, bukan getPelanggan
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const save = async () => {
    if (!formData.nama || !formData.alamat || !formData.no_telp) {
      alert("Semua field wajib diisi!");
      return;
    }

    try {
      if (editId) {
        await API.put(`/pelanggan/${editId}`, formData);
      } else {
        await API.post("/pelanggan", formData);
      }

      setOpen(false);
      setFormData({ nama: "", alamat: "", no_telp: "", email: "" });
      fetchData(); // 🔥 pakai fetchData
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  const tableRows = currentRows.map((row) => ({
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
    tanggal: (
      <SoftTypography variant="caption" color="text">
        {row.updated_at
          ? new Date(row.updated_at).toISOString().split("T")[0]
          : row.created_at
            ? new Date(row.created_at).toISOString().split("T")[0]
            : "-"}
      </SoftTypography>
    ),

    aksi: (
      <SoftBox
        display="flex"
        alignItems="center"
        gap={1}
        justifyContent="center"
      >
        <IconButton color="info" size="small" onClick={() => openEdit(row)}>
          <EditIcon />
        </IconButton>

        <IconButton
          color="error"
          size="small"
          onClick={() => remove(row.id_pelanggan)}
        >
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

                <Button
                  variant="contained"
                  color="success"
                  onClick={openAdd}
                  sx={{ color: "inherit", minWidth: "150px" }}
                >
                  <Icon sx={{ mr: 1, color: "black !important" }}>add</Icon>
                  <SoftTypography
                    fontSize="13px"
                    fontWeight="medium"
                    color="black"
                  >
                    Tambah Pelanggan
                  </SoftTypography>
                </Button>
              </SoftBox>

              <SoftBox
                sx={{
                  "& .MuiTableRow-root:not(:last-child)": {
                    "& td": {
                      borderBottom: ({
                        borders: { borderWidth, borderColor },
                      }) => `${borderWidth[1]} solid ${borderColor}`,
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
                    Page {page} of {Math.ceil(rows.length / rowsPerPage)}
                  </SoftTypography>

                  <Button
                    variant="outlined"
                    disabled={page === Math.ceil(rows.length / rowsPerPage)}
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

      {/* MODAL INPUT */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
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
            {editId ? "Edit Pelanggan" : "Tambah Pelanggan"}
          </SoftTypography>

          {/* Input Fields */}
          {["nama", "alamat", "no_telp", "email"].map((field) => (
            <Box key={field} display="flex" flexDirection="column" gap={1}>
              <SoftTypography variant="caption" fontWeight="medium">
                {field === "nama"
                  ? "Nama Pelanggan"
                  : field === "alamat"
                    ? "Alamat"
                    : field === "no_telp"
                      ? "Nomor Telepon"
                      : "Email"}
              </SoftTypography>
              <TextField
                fullWidth
                variant="outlined"
                value={formData[field]}
                onChange={(e) =>
                  setFormData({ ...formData, [field]: e.target.value })
                }
              />
            </Box>
          ))}

          {/* Buttons */}
          <Box mt={3} textAlign="right">
            <Button
              sx={{ color: "#FF0000 !important", mr: 2 }}
              onClick={() => setOpen(false)}
            >
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
