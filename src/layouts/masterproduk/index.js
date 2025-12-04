import React, { useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Card, Box, Button, Modal, FormControl, Select, TextField, IconButton, MenuItem, InputLabel } from "@mui/material";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import SoftTypography from "components/SoftTypography";
import SoftBox from "components/SoftBox";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import produkTableData from "./data/produk";

export default function MasterProduk() {
  const { columns, rows: rawRows } = produkTableData || { columns: [], rows: [] };

  const [data, setData] = useState(Array.isArray(rawRows) ? rawRows : []);

  const [open, setOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const [detailProduk, setDetailProduk] = useState(null);

  const [form, setForm] = useState({
    id_produk: "",
    nama_produk: "",
    kategori: "",
    harga_jual: "",
    stok: "",
    satuan: "",
    created_at: "",
    updated_at: "",
  });

  function generateIDProduk(currentData) {
    if (!Array.isArray(currentData) || currentData.length === 0) return "PRD-001";

    const reversed = [...currentData].reverse();
    let foundNum = null;
    for (const item of reversed) {
      if (!item || !item.id_produk) continue;
      const parts = String(item.id_produk).split("-");
      const maybeNum = parts[parts.length - 1];
      const parsed = parseInt(maybeNum, 10);
      if (!Number.isNaN(parsed)) {
        foundNum = parsed;
        break;
      }
    }

    const next = (foundNum === null) ? 1 : foundNum + 1;
    return `PRD-${String(next).padStart(3, "0")}`;
  }

  function getDetail(id) {
    return data.find((p) => p.id_produk === id);
  }

  function updateStok(id, nilaiBaru) {
    setData((prev) =>
      prev.map((p) => (p && p.id_produk === id ? { ...p, stok: nilaiBaru } : p))
    );
  }

  function openAdd() {
    setEditingIndex(null);

    const newId = generateIDProduk(data);

    setForm({
      id_produk: newId,
      nama_produk: "",
      kategori: "",
      harga_jual: "",
      stok: "",
      satuan: "",
      created_at: new Date().toISOString().split("T")[0],
      updated_at: "",
    });

    setOpen(true);
  }

  function openEdit(i) {
    setEditingIndex(i);
    const row = data[i] || {};
    setForm({ ...row });
    setOpen(true);
  }

  function openDetailPopup(row) {
    setDetailProduk(row);
    setOpenDetail(true);
  }

  function save() {
    if (!form.nama_produk || String(form.nama_produk).trim() === "") {
      alert("Nama produk harus diisi.");
      return;
    }

    if (editingIndex === null) {
      const exists = data.some((d) => d.id_produk === form.id_produk);
      const finalForm = {
        ...form,
        created_at: form.created_at || new Date().toISOString().split("T")[0],
        updated_at: "",
      };

      if (exists) {
        let attempt = 0;
        let newId = form.id_produk;
        while (data.some((d) => d.id_produk === newId) && attempt < 1000) {
          newId = generateIDProduk(data);
          attempt++;
        }
        finalForm.id_produk = newId;
      }

      setData((prev) => [...prev, finalForm]);
    } else {
      const updatedForm = {
        ...form,
        updated_at: new Date().toISOString().split("T")[0],
      };

      const original = data[editingIndex] || {};
      if (String(original.stok) !== String(updatedForm.stok)) {
        updateStok(updatedForm.id_produk, updatedForm.stok);
      }

      setData((prev) =>
        prev.map((r, idx) => (idx === editingIndex ? updatedForm : r))
      );
    }
    setOpen(false);
  }

  function remove(i) {
    if (!window.confirm("Hapus produk ini?")) return;
    setData((prev) => prev.filter((_, idx) => idx !== i));
  }

  const tableRows = data.map((row, index) => ({
    id_produk: (
      <SoftTypography
        variant="caption"
        color="text"
        onClick={() => openDetailPopup(row)}
        style={{ cursor: "pointer" }}
      >
        {row?.id_produk ?? "-"}
      </SoftTypography>
    ),
    nama_produk: (
      <SoftTypography variant="caption" color="text">
        {row?.nama_produk ?? "-"}
      </SoftTypography>
    ),
    kategori: (
      <SoftTypography variant="caption" color="text">
        {row?.kategori ?? "-"}
      </SoftTypography>
    ),
    harga_jual: (
      <SoftTypography variant="caption" color="text">
        {row?.harga_jual ?? "-"}
      </SoftTypography>
    ),
    stok: (
      <SoftTypography variant="caption" color="text">
        {row?.stok ?? "-"}
      </SoftTypography>
    ),
    satuan: (
      <SoftTypography variant="caption" color="text">
        {row?.satuan ?? "-"}
      </SoftTypography>
    ),
    tanggal: (
      <SoftTypography variant="caption" color="text">
        {row?.updated_at || row?.created_at || "-"}
      </SoftTypography>
    ),
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
                <SoftTypography variant="h6">Master Produk</SoftTypography>

                <Button
                  variant="contained"
                  color="success"
                  onClick={openAdd}
                  sx={{ color: "inherit", minWidth: "150px" }}
                >
                  <Icon sx={{ mr: 1, color: "black !important" }}>add</Icon>
                  <SoftTypography fontSize="13px" fontWeight="medium" color="black">
                    Tambah Produk
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
                <Table
                  columns={[...columns, { name: "aksi", label: "Aksi", align: "center" }]}
                  rows={tableRows}
                />
              </SoftBox>
            </Card>
          </Grid>
        </Grid>
      </SoftBox>

      <Modal open={openDetail} onClose={() => setOpenDetail(false)}>
        <Box
          sx={{
            width: 400,
            p: 3,
            bgcolor: "background.paper",
            mx: "auto",
            mt: "10vh",
            borderRadius: 1,
          }}
        >
          <SoftTypography variant="h6" mb={2}>
            Detail Produk
          </SoftTypography>

          {detailProduk ? (
            <>
              {Object.entries(detailProduk).map(([key, val]) => (
                <Box key={key} mb={1}>
                  <SoftTypography fontWeight="medium">
                    {key.toUpperCase()}
                  </SoftTypography>
                  <SoftTypography color="text">{String(val ?? "-")}</SoftTypography>
                </Box>
              ))}
            </>
          ) : (
            <SoftTypography color="text">Tidak ada data</SoftTypography>
          )}
        </Box>
      </Modal>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            width: 480,
            p: 3,
            bgcolor: "background.paper",
            mx: "auto",
            mt: "10vh",
            borderRadius: 1,
          }}
        >
          <SoftTypography variant="h6" mb={2}>
            {editingIndex === null ? "Tambah Produk" : "Edit Produk"}
          </SoftTypography>

          <Box mb={2}>
            <SoftTypography variant="caption" fontWeight="medium">
              ID PRODUK
            </SoftTypography>
            <TextField
              fullWidth
              value={form.id_produk}
              InputProps={{ readOnly: true }}
            />
          </Box>

          <Box mb={2}>
            <SoftTypography variant="caption" fontWeight="medium">
              NAMA PRODUK
            </SoftTypography>
            <TextField
              fullWidth
              variant="outlined"
              value={form.nama_produk}
              onChange={(e) => setForm({ ...form, nama_produk: e.target.value })}
            />
          </Box>

          <Box mb={2}>
            <SoftTypography variant="caption" fontWeight="medium">
              KATEGORI
            </SoftTypography>

            <div
              style={{
                position: "relative",
                marginTop: 6,
              }}
            >
              <select
                value={form.kategori}
                onChange={(e) => setForm({ ...form, kategori: e.target.value })}
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
                <option value="" disabled>Pilih kategori</option>
                <option value="Makanan">Makanan</option>
                <option value="Minuman">Minuman</option>
                <option value="Kebutuhan Rumah">Kebutuhan Rumah</option>
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
          </Box>

          <Box mb={2}>
            <SoftTypography variant="caption" fontWeight="medium">
              HARGA JUAL
            </SoftTypography>
            <TextField
              fullWidth
              variant="outlined"
              value={form.harga_jual}
              onChange={(e) => setForm({ ...form, harga_jual: e.target.value })}
              InputProps={{
                inputProps: { inputMode: "numeric", pattern: "[0-9]*" },
                sx: {
                  "& input[type=number]": {
                    MozAppearance: "textfield",
                  },
                  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                    WebkitAppearance: "none",
                    margin: 0,
                  },
                },
              }}
            />
          </Box>

          <Box mb={2}>
            <SoftTypography variant="caption" fontWeight="medium">
              STOK
            </SoftTypography>
            <TextField
              fullWidth
              variant="outlined"
              value={form.stok}
              onChange={(e) => setForm({ ...form, stok: e.target.value })}
              InputProps={{
                inputProps: { inputMode: "numeric", pattern: "[0-9]*" },
                sx: {
                  "& input[type=number]": {
                    MozAppearance: "textfield",
                  },
                  "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                    WebkitAppearance: "none",
                    margin: 0,
                  },
                },
              }}
            />
          </Box>

          <Box mb={2}>
            <SoftTypography variant="caption" fontWeight="medium">
              SATUAN
            </SoftTypography>
            <div
              style={{
                position: "relative",
                marginTop: 6,
              }}
            >
              <select
                value={form.satuan}
                onChange={(e) => setForm({ ...form, satuan: e.target.value })}

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
                <option value="" disabled>Pilih Satuan</option>
                <option value="pcs">Pcs</option>
                <option value="box">Box</option>
                <option value="lusin">Lusin</option>
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
          </Box>

          <Box mt={3} textAlign="right">
            <Button sx={{ color: "#FF0000 !important", mr: 2 }} onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button variant="contained" color="info" onClick={save}>
              Simpan
            </Button>
          </Box>
        </Box>
      </Modal>
      <Footer />
    </DashboardLayout>
  );
}
