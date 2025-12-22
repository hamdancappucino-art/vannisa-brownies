import React, { useState, useEffect } from "react";
import API from "api/api";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import CustomDialog from "components/CustomDialog";
import Table from "examples/Tables/Table";

import laporanPenjualanTableData from "./data/penjualan";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export default function LaporanPenjualan() {
  const { rows: initialRows, columns } = laporanPenjualanTableData;

  const [data, setData] = useState(initialRows);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [open, setOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);

  const [errors, setErrors] = useState({});
  const [dialog, setDialog] = useState({
    open: false,
    title: "",
    subtitle: "",
    type: "success",
  });

  const showDialog = ({ title, subtitle, type }) => {
    setDialog({
      open: true,
      title,
      subtitle,
      type,
    });
  };

  const [form, setForm] = useState({
    id_jurnal_penjualan: "",
    id_penjualan: "",
    tanggal: "",
    kode: "",
    nominal: "",
    tipe_balance: "",
    keterangan: "",
    created_at: "",
  });

  const validateModal = () => {
    const newErrors = {};

    if (!form.tanggal) newErrors.tanggal = "Tanggal wajib diisi";

    if (!form.nominal || Number(form.nominal) <= 0) {
      newErrors.nominal = "Nominal harus lebih dari 0";
    }

    if (!form.tipe_balance) {
      newErrors.tipe_balance = "Tipe balance wajib diisi";
    }

    if (!form.keterangan?.trim()) {
      newErrors.keterangan = "Keterangan wajib diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    API.get("/jurnal-penjualan")
      .then((res) => {
        const mapped = res.data.map((row) => ({
          ...row,
          id_penjualan: row.id_transaksi
        }));
        setData(mapped);
      })
      .catch((err) => {
        console.error("Gagal load jurnal:", err);
      });
  }, []);

  const filteredData = data.filter((row) => {
    if (!startDate || !endDate) return true;

    const rowDate = formatDate(row.tanggal);
    return rowDate >= startDate && rowDate <= endDate;
  });

  const sortedData = [...filteredData].sort(
    (a, b) => Number(a.id_jurnal_penjualan) - Number(b.id_jurnal_penjualan)
  );

  // PAGINATION
  const indexOfLastRow = page * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = sortedData.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / rowsPerPage));

  // OPEN EDIT
  function openEdit(row) {
    setForm({ ...row });
    setOpen(true);
  }

  // SAVE EDIT
  function save() {
    if (!validateModal()) return;

    const id = form.id_jurnal_penjualan;

    API.put(`/jurnal-penjualan/${id}`, {
      tanggal: form.tanggal,
      id_coa: form.id_coa || 3,
      nominal: Number(form.nominal),
      tipe_balance: form.tipe_balance || "kredit",
      keterangan: form.keterangan,
    })
      .then(() => {
        setData((prev) =>
          prev.map((item) =>
            item.id_jurnal_penjualan === id
              ? { ...form, nominal: Number(form.nominal) }
              : item
          )
        );

        setOpen(false);
        setErrors({});

        showDialog({
          title: "Berhasil",
          subtitle: "Data jurnal penjualan berhasil diperbarui",
          type: "success",
        });
      })
      .catch((err) => {
        console.error("Gagal update jurnal:", err);

        showDialog({
          title: "Gagal",
          subtitle: "Terjadi kesalahan saat menyimpan data",
          type: "error",
        });
      });
  }

  // DELETE ROW
  function remove(id) {
    showDialog({
      title: "Hapus Data?",
      subtitle: "Data jurnal yang dihapus tidak bisa dikembalikan",
      type: "warning",
      onConfirm: () => {
        API.delete(`/jurnal-penjualan/${id}`)
          .then(() => {
            setData((prev) =>
              prev.filter((item) => item.id_jurnal_penjualan !== id)
            );

            showDialog({
              title: "Berhasil",
              subtitle: "Data berhasil dihapus",
              type: "success",
            });
          })
          .catch(() => {
            showDialog({
              title: "Gagal",
              subtitle: "Data gagal dihapus",
              type: "error",
            });
          });
      },
    });
  }

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

  // BUILD TABLE ROWS (untuk ditampilkan di Soft UI Dashboard)
  const tableRows = currentRows.map((row, index) => ({
    id_jurnal_penjualan: row.id_jurnal_penjualan,
    id_penjualan: row.id_penjualan,

    tanggal: (
      <SoftTypography variant="caption" color="text">
        {formatDate(row.tanggal)}
      </SoftTypography>
    ),
    kode: (
      <SoftTypography variant="caption" color="text">
        {row.kode}
      </SoftTypography>
    ),
    nominal: (
      <SoftTypography variant="caption" color="text">
        Rp{Number(row.nominal).toLocaleString("id-ID")}
      </SoftTypography>
    ),
    tipe_balance: (
      <SoftTypography variant="caption" color="text">
        {row.tipe_balance}
      </SoftTypography>
    ),
    keterangan: (
      <SoftTypography variant="caption" color="text">
        {row.keterangan}
      </SoftTypography>
    ),
    created_at: (
      <SoftTypography variant="caption" color="text">
        {formatDate(row.created_at)}
      </SoftTypography>
    ),

    action: (
      <SoftBox display="flex" justifyContent="center" gap={1}>
        <IconButton color="info" size="small" onClick={() => openEdit(row)}>
          <EditIcon />
        </IconButton>
        <IconButton color="error" size="small" sx={{ color: "red !important" }} onClick={() => remove(row.id_jurnal_penjualan)}>
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
              {/* FILTER */}
              <SoftBox p={3}>
                <SoftTypography variant="h6">Jurnal Penjualan</SoftTypography>
                <Grid container spacing={2} mb={2} alignItems="flex-end">
                  <Grid item xs={12} md={3}>
                    <SoftTypography fontSize="14px" fontWeight="medium">
                      Tanggal Awal
                    </SoftTypography>
                    <TextField type="date" fullWidth size="medium" value={startDate} onChange={(e) => setStartDate(e.target.value)} sx={{
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
                    }} />
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <SoftTypography fontSize="14px" fontWeight="medium">
                      Tanggal Akhir
                    </SoftTypography>
                    <TextField type="date" fullWidth size="medium" value={endDate} onChange={(e) => setEndDate(e.target.value)} sx={{
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
                    }} />
                  </Grid>

                  <Grid item xs={12} md={1.5}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{ mt: { xs: 4, md: 4 } }}
                      onClick={() => setPage(1)}
                    >
                      <Icon sx={{ mr: 1, color: "white !important" }}>search</Icon>
                      <SoftTypography fontSize="13px" fontWeight="medium" color="white">
                        Tampilkan
                      </SoftTypography>
                    </Button>
                  </Grid>
                </Grid>
              </SoftBox>

              {/* TABLE */}
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
                  columns={[...columns, { name: "action", align: "center", label: "Aksi" }]}
                  rows={tableRows}
                />
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
            Edit Data Jurnal Penjualan
          </SoftTypography>

          {[
            "tanggal",
            "kode",
            "nominal",
            "keterangan",
          ].map((field) => (
            <Box key={field} mb={2}>
              <SoftTypography variant="caption">
                {field.toUpperCase()}
              </SoftTypography>

              <TextField
                fullWidth
                type={field === "tanggal" || field === "created_at" ? "date" : "text"}
                value={form[field] || ""}
                error={!!errors[field]}
                helperText={errors[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              />
            </Box>
          ))}
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
            <Button onClick={() => setOpen(false)} sx={{ color: "red", mr: 2 }}>
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
