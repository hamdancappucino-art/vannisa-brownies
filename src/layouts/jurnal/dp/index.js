import API from "api/api";
import React, { useEffect, useState } from "react";

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

import laporanDPTableData from "./data/dp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export default function JurnalDP() {
  const { columns } = laporanDPTableData;

  const [data, setData] = useState([]);
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

  const [form, setForm] = useState({
    id_jurnal_dp: "",
    tanggal: "",
    kode: "",
    nominal: "",
    tipe_balance: "",
    keterangan: "",
    created_at: "",
  });

  const fetchData = async () => {
    try {
      const res = await API.get("/jurnal-dp");
      setData(res.data);
    } catch (err) {
      alert("Gagal mengambil data jurnal DP");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  function openEditById(id) {
    const found = data.find((d) => d.id_jurnal_dp === id);
    if (!found) return;

    setForm({
      ...found,
      tanggal: formatDate(found.tanggal),
    });
    setOpen(true);
  }

  async function save() {
    if (!validateForm()) {
      showDialog({
        title: "Validasi Gagal",
        subtitle: "Mohon lengkapi semua data dengan benar",
        type: "warning",
      });
      return;
    }

    try {
      await API.put(`/jurnal-dp/${form.id_jurnal_dp}`, {
        tanggal: form.tanggal,
        kode: form.kode,
        nominal: Number(form.nominal),
        tipe_balance: form.tipe_balance,
        keterangan: form.keterangan,
      });

      setOpen(false);
      setErrors({});
      fetchData();

      showDialog({
        title: "Berhasil",
        subtitle: "Data jurnal DP berhasil diperbarui",
        type: "success",
      });
    } catch (err) {
      showDialog({
        title: "Gagal",
        subtitle: err.response?.data?.message || "Gagal update jurnal DP",
        type: "error",
      });
    }
  }

  async function removeById(id) {
    setDialog({
      open: true,
      title: "Konfirmasi",
      message: "Yakin ingin menghapus jurnal ini?",
      type: "confirm",
      onConfirm: async () => {
        try {
          await API.delete(`/jurnal-dp/${id}`);
          fetchData();
          showDialog("Berhasil", "Data berhasil dihapus", "success");
        } catch (err) {
          showDialog("Gagal", "Gagal menghapus jurnal DP", "error");
        }
      },
    });
  }

  function formatDate(dateString) {
    if (!dateString) return "";

    if (dateString.includes(" ")) {
      return dateString.split(" ")[0];
    }

    if (dateString.includes("T")) {
      return dateString.split("T")[0];
    }

    return dateString;
  }

  const sortedData = [...data].sort(
    (a, b) => Number(a.id_jurnal_dp) - Number(b.id_jurnal_dp)
  );

  // PAGINATION
  const indexOfLastRow = page * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  const currentRows = sortedData.slice(
    indexOfFirstRow,
    indexOfLastRow
  );

  const totalPages = Math.max(
    1,
    Math.ceil(sortedData.length / rowsPerPage)
  );

  const closeModal = () => {
    setOpen(false);
    setErrors({});
  };

  const tableRows = currentRows.map((row, index) => ({
    id_jurnal_dp: (
      <SoftTypography variant="caption">{row.id_jurnal_dp}</SoftTypography>
    ),
    id_dp: (
      <SoftTypography variant="caption">{row.id_dp}</SoftTypography>
    ),
    tanggal: (
      <SoftTypography variant="caption">{formatDate(row.tanggal)}</SoftTypography>
    ),
    kode: (
      <SoftTypography variant="caption">{row.kode}</SoftTypography>
    ),
    nominal: (
      <SoftTypography variant="caption">
        Rp{Number(row.nominal).toLocaleString("id-ID")}
      </SoftTypography>
    ),
    tipe_balance: (
      <SoftTypography variant="caption">{row.tipe_balance}</SoftTypography>
    ),
    keterangan: (
      <SoftTypography variant="caption">{row.keterangan}</SoftTypography>
    ),
    created_at: (
      <SoftTypography variant="caption">{row.created_at}</SoftTypography>
    ),
    action: (
      <SoftBox display="flex" justifyContent="center" gap={1}>
        <IconButton
          size="small"
          color="info"
          onClick={() => openEditById(row.id_jurnal_dp)}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          size="small"
          color="error"
          onClick={() => removeById(row.id_jurnal_dp)}
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
              <SoftBox p={3}>
                <SoftTypography variant="h6">Jurnal DP</SoftTypography>
                <Grid container spacing={2} mb={2} alignItems="flex-end">
                  <Grid item xs={12} md={3}>
                    <SoftTypography fontSize="14px" fontWeight="medium">
                      Tanggal Awal
                    </SoftTypography>
                    <TextField type="date" fullWidth size="medium" />
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <SoftTypography fontSize="14px" fontWeight="medium">
                      Tanggal Akhir
                    </SoftTypography>
                    <TextField type="date" fullWidth size="medium" />
                  </Grid>

                  <Grid item xs={12} md={1.5}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{ mt: { xs: 4, md: 4 } }}
                    >
                      <Icon sx={{ mr: 1, color: "white !important" }}>search</Icon>
                      <SoftTypography fontSize="13px" fontWeight="medium" color="white">
                        Tampilkan
                      </SoftTypography>
                    </Button>
                  </Grid>
                </Grid>
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
                    disabled={page === 1 || sortedData.length === 0}
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
                    disabled={page === totalPages || sortedData.length === 0}
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

      <Modal open={open} onClose={closeModal}>
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
            Edit Data Jurnal DP
          </SoftTypography>

          {[
            "tanggal",
            "kode",
            "nominal",
            "keterangan",
          ].map((f) => (
            <Box key={f} mb={2}>
              <SoftTypography variant="caption" fontWeight="medium">
                {f.toUpperCase()}
              </SoftTypography>
              <TextField
                fullWidth
                type={f === "tanggal" ? "date" : "text"}
                value={form[f]}
                error={!!errors[f]}
                helperText={errors[f]}
                onChange={(e) => setForm({ ...form, [f]: e.target.value })}
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
