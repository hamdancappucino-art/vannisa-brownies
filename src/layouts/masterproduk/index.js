import React, { useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Card, Box, Button, Modal, TextField, IconButton } from "@mui/material";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import SoftTypography from "components/SoftTypography";
import SoftBox from "components/SoftBox";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Footer from "examples/Footer";

import Table from "examples/Tables/Table";

// DATA PRODUK
import produkTableData from "./data/produk";

export default function MasterProduk() {
  const { columns, rows: rawRows } = produkTableData;

  const [data, setData] = useState(rawRows);
  const [open, setOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const [form, setForm] = useState({
    id_produk: "",
    nama_produk: "",
    kategori: "",
    harga_jual: "",
    stok: "",
    satuan: "",
  });

  // OPEN ADD
  function openAdd() {
    setEditingIndex(null);
    setForm({
      id_produk: "",
      nama_produk: "",
      kategori: "",
      harga_jual: "",
      stok: "",
      satuan: "",
    });
    setOpen(true);
  }

  // OPEN EDIT
  function openEdit(i) {
    setEditingIndex(i);
    setForm(data[i]);
    setOpen(true);
  }

  // SAVE
  function save() {
    if (editingIndex === null) {
      setData((prev) => [...prev, form]);
    } else {
      setData((prev) => prev.map((r, idx) => (idx === editingIndex ? form : r)));
    }
    setOpen(false);
  }

  // DELETE
  function remove(i) {
    if (!confirm("Hapus produk ini?")) return;
    setData((prev) => prev.filter((_, idx) => idx !== i));
  }

  // ROWS for TABLE UI
  const tableRows = data.map((row, index) => ({
    id_produk: <SoftTypography variant="caption" color="text">{row.id_produk}</SoftTypography>,
    nama_produk: <SoftTypography variant="caption" color="text">{row.nama_produk}</SoftTypography>,
    kategori: <SoftTypography variant="caption" color="text">{row.kategori}</SoftTypography>,
    harga_jual: <SoftTypography variant="caption" color="text">{row.harga_jual}</SoftTypography>,
    stok: <SoftTypography variant="caption" color="text">{row.stok}</SoftTypography>,
    satuan: <SoftTypography variant="caption" color="text">{row.satuan}</SoftTypography>,

    aksi: (
      <SoftBox display="flex" alignItems="center" justifyContent="center" gap={1}>
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

      <Box p={3}>
        <Card sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <SoftTypography variant="h6">Master Produk</SoftTypography>

            <Button variant="contained" color="success" onClick={openAdd}>
              <Icon sx={{ mr: 1 }}>add</Icon>
              Tambah Produk
            </Button>
          </Box>

          <SoftBox>
            <Table columns={[...columns, { name: "aksi", label: "Aksi", align: "center" }]} rows={tableRows} />
          </SoftBox>
        </Card>
      </Box>

      {/* MODAL */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 480, p: 3, bgcolor: "background.paper", mx: "auto", mt: "10vh", borderRadius: 1 }}>
          <SoftTypography variant="h6" mb={2}>
            {editingIndex === null ? "Tambah Produk" : "Edit Produk"}
          </SoftTypography>

          {["id_produk", "nama_produk", "kategori", "harga_jual", "stok", "satuan"].map((field) => (
            <Box key={field} mb={2}>
              <SoftTypography variant="caption" fontWeight="medium">
                {field.replace("_", " ").toUpperCase()}
              </SoftTypography>
              <TextField
                fullWidth
                variant="outlined"
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              />
            </Box>
          ))}

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
