import React, { useState } from "react";
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
import AddIcon from "@mui/icons-material/Add";
import Footer from "examples/Footer";

import Table from "examples/Tables/Table";

import bebanTableData from "./data/beban";

export default function BebanOperasional() {
  const { columns, rows: rawRows } = bebanTableData;

  const [data, setData] = useState(rawRows);
  const [open, setOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);

  const indexOfLastRow = page * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

  const [form, setForm] = useState({
    jenis_beban: "",
    kode_akun: "",
    nominal: "",
    tanggal_beban: "",
    keterangan: "",
    id_user: 1,
    created_at: "",
  });

  function formatDate(dateString) {
    const d = new Date(dateString);
    if (isNaN(d)) return dateString;
    return d.toISOString().slice(0, 10);
  }

  function openAdd() {
    setEditingIndex(null);
    setForm({
      jenis_beban: "",
      kode_akun: "",
      nominal: "",
      tanggal_beban: "",
      keterangan: "",
      id_user: 1,
      created_at: new Date().toISOString().slice(0, 19).replace("T", " "),
    });
    setOpen(true);
  }

  function openEdit(i) {
    setEditingIndex(i);
    setForm(data[i]);
    setOpen(true);
  }

  function save() {
    if (editingIndex === null) {
      setData((prev) => [
        {
          ...form,
          id: Math.max(0, ...prev.map((r) => r.id)) + 1,
        },
        ...prev,
      ]);
    } else {
      setData((prev) =>
        prev.map((r, idx) => (idx === editingIndex ? form : r))
      );
    }
    setOpen(false);
    setPage(1);
  }

  function remove(i) {
    if (!confirm("Hapus data beban ini?")) return;
    setData((prev) => prev.filter((_, idx) => idx !== i));
    setPage(1);
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
          {row.id_user}
        </SoftTypography>
      ),
      created_at: (
        <SoftTypography variant="caption" color="text">
          {formatDate(row.created_at)}
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
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
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
              onChange={(e) => setForm({ ...form, jenis_beban: e.target.value })}
            />
          </Box>

          <Box display="flex" flexDirection="column" gap={1}>
            <SoftTypography variant="caption" fontWeight="medium">
              Kode Akun
            </SoftTypography>
            <TextField
              fullWidth
              variant="outlined"
              value={form.kode_akun}
              onChange={(e) => setForm({ ...form, kode_akun: e.target.value })}
            />
          </Box>

          <Box display="flex" flexDirection="column" gap={1}>
            <SoftTypography variant="caption" fontWeight="medium">
              Nominal
            </SoftTypography>
            <TextField
              fullWidth
              variant="outlined"
              type="number"
              value={form.nominal}
              onChange={(e) => setForm({ ...form, nominal: e.target.value })}
            />
          </Box>

          <Box display="flex" flexDirection="column" gap={1}>
            <SoftTypography variant="caption" fontWeight="medium">
              Tanggal Beban
            </SoftTypography>
            <TextField
              fullWidth
              type="date"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              value={form.tanggal_beban}
              onChange={(e) => setForm({ ...form, tanggal_beban: e.target.value })}
            />
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
