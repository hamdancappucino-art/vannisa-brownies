import React, { useState } from "react";
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
import AddIcon from "@mui/icons-material/Add";
import Footer from "examples/Footer";

// Table Soft UI
import Table from "examples/Tables/Table";

// DATA RAW
import coaTableData from "./data/coa";

export default function MasterCOA() {
  const { columns, rows: rawRows } = coaTableData;

  // DATA STATE
  const [data, setData] = useState(rawRows);
  const [open, setOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const [form, setForm] = useState({
    kode_akun: "",
    nama_akun: "",
    header_akun: "",
    tipe_balance: "Debit",
    is_active: true,
  });

  // OPEN ADD
  function openAdd() {
    setEditingIndex(null);
    setForm({
      kode_akun: "",
      nama_akun: "",
      header_akun: "",
      tipe_balance: "Debit",
      is_active: true,
    });
    setOpen(true);
  }

  // OPEN EDIT
  function openEdit(i) {
    setEditingIndex(i);
    setForm(data[i]);
    setOpen(true);
  }

  // SAVE DATA
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
    if (!confirm("Hapus akun COA ini?")) return;
    setData((prev) => prev.filter((_, idx) => idx !== i));
  }

  // CONVERT RAW DATA → JSX untuk TABLE
  const tableRows = data.map((row, index) => ({
    kode_akun: (
      <SoftTypography variant="caption" color="text">
        {row.kode_akun}
      </SoftTypography>
    ),
    nama_akun: (
      <SoftTypography variant="caption" color="text">
        {row.nama_akun}
      </SoftTypography>
    ),
    header_akun: (
      <SoftTypography variant="caption" color="text">
        {row.header_akun}
      </SoftTypography>
    ),
    tipe_balance: (
      <SoftTypography variant="caption" color="text">
        {row.tipe_balance}
      </SoftTypography>
    ),
    is_active: (
      <SoftTypography
        variant="caption"
        color={row.is_active ? "success" : "error"}
        fontWeight="medium"
      >
        {row.is_active ? "Aktif" : "Tidak Aktif"}
      </SoftTypography>
    ),
    tanggal: (
      <SoftTypography variant="caption" color="text">
        {row?.updated_at || row?.created_at || "-"}
      </SoftTypography>
    ),
    aksi: (
      <SoftBox display="flex" alignItems="center" gap={1} justifyContent="center">
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
                  sx={{ color: "inherit", minWidth: "150px" }}
                >
                  <Icon sx={{ mr: 1, color: "black !important" }}>add</Icon>
                  <SoftTypography fontSize="13px" fontWeight="medium" color="black">
                    Tambah COA
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
              Nama Akun
            </SoftTypography>
            <TextField
              fullWidth
              variant="outlined"
              value={form.nama_akun}
              onChange={(e) => setForm({ ...form, nama_akun: e.target.value })}
            />
          </Box>

          <Box display="flex" flexDirection="column" gap={1}>
            <SoftTypography variant="caption" fontWeight="medium">
              Header Akun
            </SoftTypography>
            <TextField
              fullWidth
              variant="outlined"
              value={form.header_akun}
              onChange={(e) => setForm({ ...form, header_akun: e.target.value })}
            />
          </Box>

          <Box display="flex" flexDirection="column" gap={1}>
            <SoftTypography variant="caption" fontWeight="medium">
              Tipe Balance
            </SoftTypography>
            <TextField
              fullWidth
              variant="outlined"
              value={form.tipe_balance}
              onChange={(e) => setForm({ ...form, tipe_balance: e.target.value })}
            />
          </Box>

          <Box display="flex" flexDirection="column" gap={1}>
            <SoftTypography variant="caption" fontWeight="medium">
              Status
            </SoftTypography>
            <Box display="flex" alignItems="center" gap={1}>
              <Switch
                checked={!!form.is_active}
                onChange={(e) =>
                  setForm({ ...form, is_active: e.target.checked })
                }
              />
              <SoftTypography variant="caption" fontWeight="medium">
                {form.is_active ? "Aktif" : "Tidak Aktif"}
              </SoftTypography>
            </Box>
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
