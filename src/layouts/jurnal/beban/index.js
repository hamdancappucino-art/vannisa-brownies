import React, { useState, useEffect, useMemo } from "react";
import API from "api/api";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import { Card, Box, Button, Modal, TextField, IconButton } from "@mui/material";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";

import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import Table from "examples/Tables/Table";
import CustomDialog from "components/CustomDialog";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

// DATA TABLE HEADER
import laporanBebanTableData from "./data/beban";

export default function Beban() {
  const { columns } = laporanBebanTableData;

  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [awal, setAwal] = useState("");
  const [akhir, setAkhir] = useState("");

  const token = localStorage.getItem("token");
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);

  const [errors, setErrors] = useState({});
  const [dialog, setDialog] = useState({
    open: false,
    title: "",
    subtitle: "",
    type: "success",
  });

  const showDialog = ({ title, subtitle = "", type = "success" }) => {
    setDialog({
      open: true,
      title,
      subtitle,
      type,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.tanggal) {
      newErrors.tanggal = "Tanggal wajib diisi";
    }

    if (!form.kode?.trim()) {
      newErrors.kode = "Kode wajib diisi";
    }

    if (!form.nominal || Number(form.nominal) <= 0) {
      newErrors.nominal = "Nominal harus lebih dari 0";
    }

    if (!form.tipe_balance) {
      newErrors.tipe_balance = "Tipe balance wajib dipilih";
    }

    if (!form.keterangan?.trim()) {
      newErrors.keterangan = "Keterangan wajib diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function loadData(from = "", to = "") {
    try {
      const res = await API.get("/jurnal-beban");
      const json = res.data;

      if (!Array.isArray(json)) {
        setData([]);
        return;
      }

      let filtered = [...json];

      if (from && to) {
        filtered = filtered.filter((row) => {
          const rowDate = new Date(row.tanggal).toISOString().split("T")[0];
          return rowDate >= from && rowDate <= to;
        });
      }

      // SORT BY ID ASC
      const sorted = [...filtered].sort(
        (a, b) => a.id_jurnal_beban - b.id_jurnal_beban
      );

      setData(sorted);
    } catch (err) {
      console.error("LOAD ERROR:", err);
    }
  }

  useEffect(() => {
    loadData(awal, akhir);
  }, [awal, akhir]);

  function formatDate(dateString) {
    if (!dateString) return "";
    return dateString.split("T")[0];
  }

  const [form, setForm] = useState({
    id_jurnal_beban: "",
    id_beban: "",
    tanggal: "",
    kode: "",
    nominal: "",
    tipe_balance: "",
    keterangan: "",
  });

  // OPEN MODAL EDIT
  function openEditById(id) {
    const found = data.find((d) => d.id_jurnal_beban === id);
    if (!found) return;

    setForm({ ...found, tanggal: formatDate(found.tanggal) });
    setOpen(true);
  }

  // SAVE EDIT
  async function save() {
    if (!validateForm()) return;

    try {
      const id = form.id_jurnal_beban;

      await API.put(`/jurnal-beban/${id}`, {
        tanggal: form.tanggal,
        kode: form.kode,
        nominal: Number(form.nominal),
        tipe_balance: form.tipe_balance,
        keterangan: form.keterangan,
      });

      await loadData(awal, akhir);
      setOpen(false);
      setErrors({});

      showDialog({
        title: "Berhasil",
        subtitle: "Data jurnal beban berhasil diperbarui",
        type: "success",
      });
    } catch (err) {
      console.error("UPDATE ERROR:", err.response?.data || err.message);

      showDialog({
        title: "Gagal",
        subtitle: err.response?.data?.message || "Terjadi kesalahan saat menyimpan data",
        type: "error",
      });
    }
  }

  // DELETE JURNAL
  async function remove(id) {
    if (!confirm("Hapus jurnal ini?")) return;

    try {
      await API.delete(`/jurnal-beban/${id}`);
      await loadData(awal, akhir);

      showDialog({
        title: "Berhasil",
        subtitle: "Data jurnal beban berhasil dihapus",
        type: "success",
      });
    } catch (err) {
      console.error(err);
      showDialog({
        title: "Gagal",
        subtitle: "Gagal menghapus jurnal",
        type: "error",
      });
    }
  }

  // FILTER BUTTON PENCET
  function applyFilter() {
    loadData(awal, akhir);
  }

  const closeModal = () => {
    setOpen(false);
    setErrors({});
  };

  // PAGINATION
  const indexOfLastRow = page * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.max(1, Math.ceil(data.length / rowsPerPage));

  // RENDER ROWS
  const tableRows = useMemo(
    () =>
      currentRows.map((row, index) => ({
        id_jurnal_beban: <SoftTypography variant="caption">{row.id_jurnal_beban}</SoftTypography>,
        id_beban: <SoftTypography variant="caption">{row.id_beban}</SoftTypography>,
        tanggal: (
          <SoftTypography variant="caption">{formatDate(row.tanggal)}</SoftTypography>
        ),
        kode: <SoftTypography variant="caption">{row.kode}</SoftTypography>,
        nominal: (
          <SoftTypography variant="caption">
            {Number(row.nominal).toLocaleString("id-ID")}
          </SoftTypography>
        ),
        tipe_balance: <SoftTypography variant="caption">{row.tipe_balance}</SoftTypography>,
        keterangan: <SoftTypography variant="caption">{row.keterangan}</SoftTypography>,
        created_at: (
          <SoftTypography variant="caption">{formatDate(row.created_at)}</SoftTypography>
        ),

        aksi: (
          <SoftBox display="flex" justifyContent="center" gap={1}>
            <IconButton
              color="info"
              size="small"
              onClick={() => openEditById(row.id_jurnal_beban)}
            >
              <EditIcon />
            </IconButton>
            <IconButton color="error" size="small" onClick={() => remove(row.id_jurnal_beban)}>
              <DeleteIcon />
            </IconButton>
          </SoftBox>
        ),
      })),
    [currentRows]
  );

  const columnsFix = useMemo(
    () => [...columns, { name: "aksi", label: "Aksi", align: "center" }],
    []
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <SoftBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              {/* FILTER */}
              <SoftBox p={3}>
                <SoftTypography variant="h6">Jurnal Beban</SoftTypography>

                <Grid container spacing={2} mt={1.5} mb={2}>
                  <Grid item xs={12} md={3}>
                    <SoftTypography fontSize="14px">Tanggal Awal</SoftTypography>
                    <TextField
                      type="date"
                      fullWidth
                      value={awal}
                      onChange={(e) => setAwal(e.target.value)}
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
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <SoftTypography fontSize="14px">Tanggal Akhir</SoftTypography>
                    <TextField
                      type="date"
                      fullWidth
                      value={akhir}
                      onChange={(e) => setAkhir(e.target.value)}
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
                  </Grid>

                  <Grid item xs={12} md={1.5}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{ mt: 2.5 }}
                      onClick={applyFilter}
                    >
                      <Icon sx={{ mr: 1, color: "white !important" }}>search</Icon>
                      <SoftTypography fontSize="13px" color="white">
                        Tampilkan
                      </SoftTypography>
                    </Button>
                  </Grid>
                </Grid>
              </SoftBox>

              {/* TABLE */}
              <SoftBox>
                <Table columns={columnsFix} rows={tableRows} />
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

      {/* MODAL EDIT */}
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
            Edit Jurnal
          </SoftTypography>

          <Box display="flex" flexDirection="column" gap={1}>
            <SoftTypography variant="caption" fontWeight="medium">
              ID Beban
            </SoftTypography>
            <TextField
              fullWidth
              variant="outlined"
              disabled
              value={form.id_beban}
              onChange={(e) => setForm({ ...form, id_beban: e.target.value })}
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

          {["tanggal", "kode", "nominal", "keterangan"].map(
            (field) => (
              <Box key={field} mb={2}>
                <SoftTypography variant="caption" fontWeight="medium">
                  {field.replace(/_/g, " ").toUpperCase()}
                </SoftTypography>
                <TextField
                  fullWidth
                  type={field === "tanggal" ? "date" : "text"}
                  value={form[field] || ""}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
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
            )
          )}

          {/* TIPE BALANCE (DEBIT / KREDIT) */}
          <Box mb={2}>
            <SoftTypography variant="caption" fontWeight="medium">
              Tipe Balance
            </SoftTypography>

            <div style={{ position: "relative", marginTop: 4 }}>
              <select
                value={form.tipe_balance}
                onChange={(e) =>
                  setForm({ ...form, tipe_balance: e.target.value })
                }
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
                <option value="" disabled>
                  Pilih Tipe Balance
                </option>
                <option value="debit">Debit</option>
                <option value="kredit">Kredit</option>
              </select>
              {errors.tipe_balance && (
                <SoftTypography color="error" fontSize="12px" mt={0.5}>
                  {errors.tipe_balance}
                </SoftTypography>
              )}

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
            <Button onClick={closeModal} sx={{ color: "red", mr: 2 }}>
              Batal
            </Button>
            <Button variant="contained" color="info" onClick={save}>
              Simpan
            </Button>
          </Box>
        </Box>
      </Modal>
      <Footer />
      <CustomDialog
        open={dialog.open}
        title={dialog.title}
        subtitle={dialog.subtitle}
        type={dialog.type}
        onClose={() => setDialog({ ...dialog, open: false })}
      />
    </DashboardLayout>
  );
}
