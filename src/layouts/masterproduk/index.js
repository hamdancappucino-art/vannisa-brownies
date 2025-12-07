import axios from "axios";
import React, { useState, useEffect } from "react";
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
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import produkTableData from "./data/produk";

const API_URL = "http://localhost:5000/api/produk";

export default function MasterProduk() {
  const { columns } = produkTableData || { columns: [] };

  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [detailProduk, setDetailProduk] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);

  const indexOfLastRow = page * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);


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

  const formatDate = (date) =>
    date ? new Date(date).toISOString().split("T")[0] : "";

  function formatKategori(kat) {
    if (!kat) return "";
    return kat
      .split("_")
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(" ");
  }

  const fetchProduk = async () => {
    try {
      const res = await axios.get(API_URL);

      const sortedData = res.data.sort((a, b) => a.id_produk - b.id_produk);

      setData(sortedData);
    } catch (err) {
      console.error("Gagal fetch produk:", err);
    }
  };

  useEffect(() => {
    fetchProduk();
  }, []);

  function generateIDProduk(arr) {
    if (!arr || arr.length === 0) return "PRD-001";

    const lastId = arr[arr.length - 1].id_produk;
    const next = Number(lastId) + 1;

    return `PRD-${String(next).padStart(3, "0")}`;
  }

  function openAdd() {
    setEditingItem(null);

    setForm({
      id_produk: generateIDProduk(data),
      nama_produk: "",
      kategori: "",
      harga_jual: "",
      stok: "",
      satuan: "",
      created_at: formatDate(new Date()),
      updated_at: "",
    });

    setOpen(true);
  }

  function openEdit(item) {
    setEditingItem(item);
    setForm({
      ...item,
      id_produk: `PRD-${String(item.id_produk).padStart(3, "0")}`,
      created_at: formatDate(item.created_at),
      updated_at: formatDate(item.updated_at),
    });
    setOpen(true);
  }

  function openDetailPopup(item) {
    setDetailProduk({
      ...item,
      created_at: formatDate(item.created_at),
      updated_at: formatDate(item.updated_at),
      id_produk: `PRD-${String(item.id_produk).padStart(3, "0")}`,
    });
    setOpenDetail(true);
  }

  async function save() {
    if (!form.nama_produk) {
      alert("Nama produk wajib diisi");
      return;
    }

    try {
      if (editingItem === null) {
        const payload = { ...form };
        delete payload.id_produk;

        await axios.post(API_URL, payload);
      } else {
        await axios.put(`${API_URL}/${editingItem.id_produk}`, form);
      }

      fetchProduk();
      setOpen(false);
    } catch (err) {
      console.error("Gagal menyimpan produk:", err);
      alert("Error saat menyimpan data");
    }
  }

  async function remove(item) {
    if (!window.confirm("Hapus produk ini?")) return;

    try {
      await axios.delete(`${API_URL}/${item.id_produk}`);
      fetchProduk();
    } catch (err) {
      console.error("Gagal hapus produk:", err);
    }
  }

  const tableRows = currentRows.map((row) => ({
    id_produk: (
      <SoftTypography
        variant="caption"
        color="text"
        style={{ cursor: "pointer" }}
        onClick={() => openDetailPopup(row)}
      >
        {`PRD-${String(row.id_produk).padStart(3, "0")}`}
      </SoftTypography>
    ),
    nama_produk: row.nama_produk,
    kategori: formatKategori(row.kategori),
    harga_jual: row.harga_jual,
    stok: row.stok,
    satuan: row.satuan,
    tanggal: formatDate(row.updated_at || row.created_at),
    aksi: (
      <SoftBox display="flex" alignItems="center" justifyContent="center" gap={1}>
        <IconButton color="info" size="small" onClick={() => openEdit(row)}>
          <EditIcon />
        </IconButton>
        <IconButton color="error" size="small" onClick={() => remove(row)}>
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

      {/* MODAL DETAIL */}
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
            Object.entries(detailProduk).map(([key, value]) => (
              <Box key={key} mb={1}>
                <SoftTypography fontWeight="medium">{key.toUpperCase()}</SoftTypography>
                <SoftTypography color="text">{value}</SoftTypography>
              </Box>
            ))
          ) : (
            <SoftTypography>Tidak ada data</SoftTypography>
          )}
        </Box>
      </Modal>

      {/* MODAL FORM */}
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
            {editingItem ? "Edit Produk" : "Tambah Produk"}
          </SoftTypography>

          {/* ID PRODUK */}
          <Box mb={2}>
            <SoftTypography variant="caption" fontWeight="medium">ID Produk</SoftTypography>
            <TextField fullWidth value={form.id_produk} InputProps={{ readOnly: true }} />
          </Box>

          {/* INPUT LAIN */}
          {[
            ["nama_produk", "Nama Produk"],
            ["harga_jual", "Harga Jual"],
            ["stok", "Stok"],
          ].map(([key, label]) => (
            <Box mb={2} key={key}>
              <SoftTypography variant="caption" fontWeight="medium">{label}</SoftTypography>
              <TextField
                fullWidth
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            </Box>
          ))}

          <Box mb={2}>
            <SoftTypography variant="caption" fontWeight="medium">
              Kategori
            </SoftTypography>
            <div style={{ position: "relative", marginTop: 6, }} >
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
                  width: "100%", height: "45px",
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
                <option value="brownies_kukus">Brownies Kukus</option>
                <option value="brownies_bakar">Brownies Bakar</option>
                <option value="creamcheese">CreamCheese</option>
                <option value="moscovis_cake">Moscovis Cake</option>
                <option value="bolu">Bolu</option>
                <option value="bolen">Bolen</option>
                <option value="snack">Snack</option>
              </select>
              <KeyboardArrowDownIcon
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  color: "black",
                }} />
            </div>
          </Box>

          {/* SATUAN */}
          <Box mb={2}>
            <SoftTypography variant="caption" fontWeight="medium">
              Satuan
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
                <option value="box">Box</option>
                <option value="pack">Pack</option>
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
            <Button sx={{ color: "red", mr: 2 }} onClick={() => setOpen(false)}>
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
