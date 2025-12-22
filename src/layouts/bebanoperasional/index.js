import React, { useState } from "react";
import axios from "axios";
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

import { InputAdornment } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import Footer from "examples/Footer";
import CustomDialog from "components/CustomDialog";

import Table from "examples/Tables/Table";

import bebanTableData from "./data/beban";

export default function BebanOperasional() {
  const { columns, rows: rawRows } = bebanTableData;
  const [data, setData] = useState([]);
  const [coaList, setCoaList] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [user, setUser] = useState(null);

  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);

  const indexOfLastRow = page * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.max(1, Math.ceil(data.length / rowsPerPage));

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [dialog, setDialog] = useState({
    open: false,
    title: "",
    subtitle: "",
    type: "success",
  });

  const showDialog = (title, subtitle, type = "error") => {
    setDialog({
      open: true,
      title,
      subtitle,
      type,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.jenis_beban.trim()) {
      newErrors.jenis_beban = "Jenis beban wajib diisi";
    }

    if (!form.kode_akun) {
      newErrors.kode_akun = "Kode akun wajib dipilih";
    }

    if (!form.nominal || Number(form.nominal) <= 0) {
      newErrors.nominal = "Nominal harus lebih dari 0";
    }

    if (!form.tanggal_beban) {
      newErrors.tanggal_beban = "Tanggal beban wajib diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  React.useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user") || "{}");

    if (!u.id) {
      console.error("User ID tidak ditemukan di localStorage");
    } else {
      setUser(u);
    }

    fetchBeban();
    fetchCoa();
  }, []);

  async function fetchBeban() {
    try {
      const res = await API.get("/beban");

      // SORT ASCENDING BY ID
      const sortedData = res.data.sort((a, b) => a.id - b.id);

      setData(sortedData);
      setPage(1);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchCoa() {
    try {
      const res = await API.get("/coa");
      setCoaList(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  const [form, setForm] = useState({
    jenis_beban: "",
    kode_akun: "",
    nominal: "",
    tanggal_beban: "",
    keterangan: "",
    id_user: "",
    created_at: "",
    updated_at: "",
  });

  function formatDate(dateString) {
    if (!dateString) return "";

    // handle format "YYYY-MM-DD HH:mm:ss"
    if (dateString.includes(" ")) {
      return dateString.split(" ")[0];
    }

    // handle format ISO
    if (dateString.includes("T")) {
      return dateString.split("T")[0];
    }

    return dateString;
  }

  function openAdd() {
    setEditingIndex(null);
    setIsSubmitted(false);
    setErrors({});

    setForm({
      jenis_beban: "",
      kode_akun: "",
      nominal: "",
      tanggal_beban: new Date().toISOString().slice(0, 10),
      keterangan: "",
      id_user: user?.id || null,
    });

    setOpen(true);
  }

  function openEdit(i) {
    setEditingIndex(i);
    setForm({
      jenis_beban: data[i].jenis_beban,
      kode_akun: data[i].kode_akun,
      nominal: data[i].nominal,
      tanggal_beban: formatDate(data[i].tanggal_beban),
      keterangan: data[i].keterangan,
      id_user: data[i].id_user,
    });
    setOpen(true);
  }

  async function createData() {
    try {
      await API.post("/beban", {
        ...form,
        id_user: user?.id,
      });
      fetchBeban();
      setOpen(false);
    } catch (err) {
      console.error(err);
      showDialog("Gagal", "Terjadi kesalahan saat menyimpan data", "error");
    }
  }

  async function updateData(id) {
    try {
      await API.put(`/beban/${id}`, {
        jenis_beban: form.jenis_beban,
        kode_akun: form.kode_akun,
        nominal: form.nominal,
        tanggal_beban: form.tanggal_beban,
        keterangan: form.keterangan,
        id_user: user?.id,
      });
      fetchBeban();
      setOpen(false);
    } catch (err) {
      console.error(err);
      showDialog("Gagal", "Terjadi kesalahan saat menyimpan data", "error");
    }
  }

  function save() {
    setIsSubmitted(true);

    if (!validateForm()) {
      showDialog("Validasi Gagal", "Periksa kembali input beban", "warning");
      return;
    }

    if (editingIndex === null) {
      createData();
    } else {
      const id = data[editingIndex].id;
      updateData(id);
    }
  }

  async function remove(i) {
    if (!confirm("Hapus data beban ini?")) return;

    const id = data[i].id;

    try {
      await API.delete(`/beban/${id}`);
      fetchBeban();
    } catch (err) {
      console.error(err);
      showDialog("Gagal", "Terjadi kesalahan saat menghapus data", "error");
    }
  }

  const tableRows = currentRows.map((row, index) => {
    const realIndex = indexOfFirstRow + index;
    return {
      id: (
        <SoftTypography variant="caption" color="text">
          {row.id}
        </SoftTypography>
      ),
      jenis_beban: (
        <SoftTypography variant="caption" color="text">
          {row.jenis_beban}
        </SoftTypography>
      ),
      kode_akun: (
        <SoftTypography variant="caption" color="text">
          {row.kode_akun}
        </SoftTypography>
      ),
      nominal: (
        <SoftTypography variant="caption" color="text">
          {row.nominal.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
          })}
        </SoftTypography>
      ),
      tanggal_beban: (
        <SoftTypography variant="caption" color="text">
          {formatDate(row.tanggal_beban)}
        </SoftTypography>
      ),
      keterangan: (
        <SoftTypography variant="caption" color="text">
          {row.keterangan}
        </SoftTypography>
      ),
      id_user: (
        <SoftTypography variant="caption" color="text">
          {row.user_nama}
        </SoftTypography>
      ),
      created_at: (
        <SoftTypography variant="caption" color="text">
          {row.updated_at
            ? formatDate(row.updated_at)
            : formatDate(row.created_at)}
        </SoftTypography>
      ),
      aksi: (
        <SoftBox display="flex" justifyContent="center" gap={1}>
          <IconButton color="info" size="small" onClick={() => openEdit(realIndex)}>
            <EditIcon />
          </IconButton>

          <IconButton color="error" size="small" onClick={() => remove(realIndex)}>
            <DeleteIcon />
          </IconButton>
        </SoftBox>
      ),
    }
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
                <SoftTypography variant="h6">Beban Operasional</SoftTypography>
                <Button
                  variant="contained"
                  color="success"
                  onClick={openAdd}
                  sx={{ color: "inherit", minWidth: "150px" }}
                >
                  <Icon sx={{ mr: 1, color: "black !important" }}>add</Icon>
                  <SoftTypography fontSize="13px" fontWeight="medium" color="black">
                    Tambah Beban
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
                <Table columns={[...columns, { name: "aksi", label: "Aksi", align: "center" }]} rows={tableRows} />
                <SoftBox
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  p={2}
                  gap={2}
                >
                  <Button
                    variant="outlined"
                    disabled={page === 1 || data.length === 0}
                    onClick={() => setPage(page - 1)}
                  >
                    <SoftTypography fontSize="13px" fontWeight="medium" color="black">
                      Previous
                    </SoftTypography>
                  </Button>

                  <SoftTypography variant="caption">
                    Page {page} of {totalPages}
                  </SoftTypography>

                  <Button
                    variant="outlined"
                    disabled={page === totalPages || data.length === 0}
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

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setErrors({});
          setIsSubmitted(false);
        }}
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
            {editingIndex === null ? "Tambah Beban" : "Edit Beban"}
          </SoftTypography>

          <Box display="flex" flexDirection="column" gap={1}>
            <SoftTypography variant="caption" fontWeight="medium">
              Jenis Beban
            </SoftTypography>
            <TextField
              fullWidth
              variant="outlined"
              value={form.jenis_beban}
              error={isSubmitted && !!errors.jenis_beban}
              helperText={isSubmitted ? errors.jenis_beban : ""}
              onChange={(e) => setForm({ ...form, jenis_beban: e.target.value })}
              sx={{
                "& .MuiOutlinedInput-input": {
                  maxWidth: "100% !important",
                  width: "100% !important",
                  minWidth: "100% !important",
                  flex: "1 1 auto !important",
                  display: "block !important",
                  overflow: "visible !important",
                  textOverflow: "clip !important",
                  whiteSpace: "normal !important",
                }
              }}
            />
          </Box>

          <Box display="flex" flexDirection="column" gap={1}>
            <SoftTypography variant="caption" fontWeight="medium">
              Kode Akun
            </SoftTypography>
            <div style={{ position: "relative", marginTop: 0, }} >
              <select
                value={form.kode_akun}
                onChange={(e) => setForm({ ...form, kode_akun: e.target.value })}
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
                <option value="" disabled>Pilih Kode Akun</option>
                {coaList.map((c) => (
                  <option key={c.kode_akun} value={c.kode_akun}>
                    {c.kode_akun} - {c.nama_akun}
                  </option>
                ))}
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
            {isSubmitted && errors.kode_akun && (
              <SoftTypography variant="caption" color="error">
                {errors.kode_akun}
              </SoftTypography>
            )}
          </Box>

          <Box display="flex" flexDirection="column" gap={1}>
            <SoftTypography variant="caption" fontWeight="medium">
              Nominal
            </SoftTypography>
            <TextField
              fullWidth
              variant="outlined"
              value={form.nominal}
              error={isSubmitted && !!errors.nominal}
              helperText={isSubmitted ? errors.nominal : ""}
              onChange={(e) => setForm({ ...form, nominal: e.target.value })}
              sx={{
                "& .MuiOutlinedInput-input": {
                  maxWidth: "100% !important",
                  width: "100% !important",
                  minWidth: "100% !important",
                  flex: "1 1 auto !important",
                  display: "block !important",
                  overflow: "visible !important",
                  textOverflow: "clip !important",
                  whiteSpace: "normal !important",
                }
              }}
            />
          </Box>

          <Box display="flex" flexDirection="column" gap={1}>
            <SoftTypography variant="caption" fontWeight="medium">
              Tanggal Beban
            </SoftTypography>
            <div
              style={{
                position: "relative",
                marginTop: 0,
              }}
            >
              <input
                type="date"
                value={form.tanggal_beban}
                onChange={(e) =>
                  setForm({ ...form, tanggal_beban: e.target.value })
                }
                id="dateInput"
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
                  position: "relative",
                  zIndex: 2,
                }}
              />
              <CalendarTodayIcon
                onClick={() => {
                  const input = document.getElementById("dateInput");
                  if (input?.showPicker) input.showPicker();
                }}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "black",
                  zIndex: 3,
                }}
              />
              <style>
                {`
                  input[type="date"]::-webkit-calendar-picker-indicator {
                    opacity: 0;
                    position: absolute;
                    right: 0;
                    width: 100%;
                    height: 100%;
                    cursor: pointer;
                  }
                `}
              </style>
            </div>
            {isSubmitted && errors.tanggal_beban && (
              <SoftTypography variant="caption" color="error">
                {errors.tanggal_beban}
              </SoftTypography>
            )}
          </Box>

          <Box display="flex" flexDirection="column" gap={1}>
            <SoftTypography variant="caption" fontWeight="medium">
              Keterangan
            </SoftTypography>
            <TextField
              fullWidth
              variant="outlined"
              value={form.keterangan}
              onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
              sx={{
                "& .MuiOutlinedInput-input": {
                  maxWidth: "100% !important",
                  width: "100% !important",
                  minWidth: "100% !important",
                  flex: "1 1 auto !important",
                  display: "block !important",
                  overflow: "visible !important",
                  textOverflow: "clip !important",
                  whiteSpace: "normal !important",
                }
              }}
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
      <CustomDialog
        open={dialog.open}
        onClose={() => setDialog({ ...dialog, open: false })}
        title={dialog.title}
        subtitle={dialog.subtitle}
        type={dialog.type}
      />
    </DashboardLayout>
  );
}
