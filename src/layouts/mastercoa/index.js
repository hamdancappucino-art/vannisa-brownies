import React, { useState, useEffect } from "react";
import axios from "axios";
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

import Table from "examples/Tables/Table";
import Footer from "examples/Footer";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const API_URL = "http://localhost:5000/api/coa";

export default function MasterCOA() {
  const columns = [
    { name: "kode_akun", label: "Kode Akun", align: "center" },
    { name: "nama_akun", label: "Nama Akun", align: "center" },
    { name: "header_akun", label: "Header Akun", align: "center" },
    { name: "tipe_balance", label: "Tipe Balance", align: "center" },
    { name: "is_active", label: "Status", align: "center" },
    { name: "tanggal", label: "Tanggal", align: "center" },
  ];

  // STATE
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const [form, setForm] = useState({
    kode_akun: "",
    nama_akun: "",
    header_akun: "",
    tipe_balance: "DEBIT",
    is_active: true,
  });

  // FETCH DATA
  async function fetchCOA() {
    try {
      const res = await axios.get(API_URL);
      setData(res.data); // TAMPILKAN DATA ASLI TANPA DIUBAH
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }

  useEffect(() => {
    fetchCOA();
  }, []);

  // OPEN ADD
  function openAdd() {
    setEditingIndex(null);
    setForm({
      kode_akun: "",
      nama_akun: "",
      header_akun: "",
      tipe_balance: "DEBIT",
      is_active: true,
    });
    setOpen(true);
  }

  // OPEN EDIT
  function openEdit(i) {
    setEditingIndex(i);
    setForm({
      ...data[i],
      is_active: data[i].is_active === 1, // convert 1/0 → TRUE/FALSE
    });
    setOpen(true);
  }

  // SAVE DATA
  async function save() {
    const payload = {
      kode_akun: form.kode_akun,
      nama_akun: form.nama_akun,
      header_akun: form.header_akun || null,
      tipe_balance: form.tipe_balance,
      is_active: form.is_active ? 1 : 0,
    };

    try {
      if (editingIndex === null) {
        await axios.post(API_URL, payload);
      } else {
        const kode = data[editingIndex].kode_akun;
        await axios.put(`${API_URL}/${kode}`, payload);
      }
      fetchCOA();
      setOpen(false);
    } catch (err) {
      console.error("Save error:", err);
    }
  }

  // DELETE
  async function remove(i) {
    if (!confirm("Hapus akun COA ini?")) return;
    try {
      const kode = data[i].kode_akun;
      await axios.delete(`${API_URL}/${kode}`);
      fetchCOA();
    } catch (err) {
      console.error("Delete error:", err);
    }
  }

  // TABLE ROWS
  const tableRows = data.map((row, index) => ({
    kode_akun: (
      <SoftTypography variant="caption">{row.kode_akun}</SoftTypography>
    ),
    nama_akun: (
      <SoftTypography variant="caption">{row.nama_akun}</SoftTypography>
    ),
    header_akun: (
      <SoftTypography variant="caption">{row.header_akun || "-"}</SoftTypography>
    ),
    tipe_balance: (
      <SoftTypography variant="caption">{row.tipe_balance}</SoftTypography>
    ),
    is_active: (
      <SoftTypography
        variant="caption"
        color={row.is_active ? "success" : "error"}
      >
        {row.is_active ? "Aktif" : "Tidak Aktif"}
      </SoftTypography>
    ),
    tanggal: (
      <SoftTypography variant="caption">
        {row.tanggal ? new Date(row.tanggal).toISOString().split("T")[0] : "-"}
      </SoftTypography>
    ),
    aksi: (
      <SoftBox display="flex" justifyContent="center" gap={1}>
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
                <SoftTypography variant="h6">Master COA</SoftTypography>

                <Button
                  variant="contained"
                  color="success"
                  onClick={openAdd}
                  sx={{ minWidth: "150px" }}
                >
                  <Icon sx={{ mr: 1, color: "black !important" }}>add</Icon>
                  <SoftTypography fontSize="13px" fontWeight="medium" color="black">
                    Tambah COA
                  </SoftTypography>
                </Button>
              </SoftBox>

              <SoftBox>
                <Table
                  columns={[...columns, { name: "aksi", label: "Aksi", align: "center" }]}
                  rows={tableRows}
                />
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
            width: 480,
            p: 3,
            bgcolor: "background.paper",
            borderRadius: 1,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <SoftTypography variant="h6">
            {editingIndex === null ? "Tambah COA" : "Edit COA"}
          </SoftTypography>

          {/* KODE AKUN */}
          <Box>
            <SoftTypography variant="caption">Kode Akun</SoftTypography>
            <TextField
              fullWidth
              disabled={editingIndex !== null}
              value={form.kode_akun}
              onChange={(e) => setForm({ ...form, kode_akun: e.target.value })}
            />
          </Box>

          {/* NAMA AKUN */}
          <Box>
            <SoftTypography variant="caption">Nama Akun</SoftTypography>
            <TextField
              fullWidth
              value={form.nama_akun}
              onChange={(e) => setForm({ ...form, nama_akun: e.target.value })}
            />
          </Box>

          {/* HEADER AKUN */}
          <Box>
            <SoftTypography variant="caption">Header Akun</SoftTypography>
            <TextField
              fullWidth
              value={form.header_akun}
              onChange={(e) => setForm({ ...form, header_akun: e.target.value })}
            />
          </Box>

          {/* TIPE BALANCE */}
          <Box mb={2}>
            <SoftTypography variant="caption" fontWeight="medium">
              Tipe Balance
            </SoftTypography>

            <div
              style={{
                position: "relative",
                marginTop: 6,
              }}
            >
              <select
                value={form.tipe_balance}
                onChange={(e) => setForm({ ...form, tipe_balance: e.target.value })}
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
                <option value="" disabled>Pilih Tipe Balance</option>
                <option value="DEBIT">Debit</option>
                <option value="KREDIT">Kredit</option>
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

          {/* STATUS */}
          <Box>
            <SoftTypography variant="caption">Status</SoftTypography>
            <Box display="flex" alignItems="center" gap={1}>
              <Switch
                checked={form.is_active}
                onChange={(e) =>
                  setForm({ ...form, is_active: e.target.checked })
                }
              />
              {/* <SoftTypography>{form.is_active ? "Aktif" : "Tidak Aktif"}</SoftTypography> */}
              <SoftTypography variant="caption">{form.is_active ? "Aktif" : "Tidak Aktif"}</SoftTypography>
            </Box>
          </Box>

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
