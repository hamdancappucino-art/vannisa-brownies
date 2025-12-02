import React, { useState } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import { Card, Box, Button, Modal, TextField, IconButton } from "@mui/material";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";

import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import Table from "examples/Tables/Table";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// DATA
import laporanBebanTableData from "./data/beban";

export default function Beban() {
  const { columns, rows: rawRows } = laporanBebanTableData;

  const [data, setData] = useState(rawRows);
  const [open, setOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const [form, setForm] = useState({
    id_jurnal_beban: "",
    id_beban: "",
    tanggal: "",
    kode: "",
    nominal: "",
    tipe_balance: "",
    keterangan: "",
    created_at: "",
    updated_at: "",
  });

  // OPEN EDIT
  function openEdit(i) {
    setEditingIndex(i);
    setForm({ ...data[i] });
    setOpen(true);
  }

  // SAVE EDIT
  function save() {
    const updatedForm = {
      ...form,
      updated_at: new Date().toISOString().split("T")[0],
    };

    setData((prev) =>
      prev.map((item, idx) => (idx === editingIndex ? updatedForm : item))
    );

    setOpen(false);
  }

  // DELETE
  function remove(i) {
    if (!confirm("Hapus beban ini?")) return;
    setData((prev) => prev.filter((_, idx) => idx !== i));
  }

  // TABLE VIEW
  const tableRows = data.map((row, index) => ({
    id_jurnal_beban: <SoftTypography variant="caption">{row.id_jurnal_beban}</SoftTypography>,
    id_beban: <SoftTypography variant="caption">{row.id_beban}</SoftTypography>,
    tanggal: <SoftTypography variant="caption">{row.tanggal}</SoftTypography>,
    kode: <SoftTypography variant="caption">{row.kode}</SoftTypography>,
    nominal: (
      <SoftTypography variant="caption">
        {Number(row.nominal).toLocaleString("id-ID")}
      </SoftTypography>
    ),
    tipe_balance: <SoftTypography variant="caption">{row.tipe_balance}</SoftTypography>,
    keterangan: <SoftTypography variant="caption">{row.keterangan}</SoftTypography>,
    created_at: <SoftTypography variant="caption">{row.created_at}</SoftTypography>,

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
              {/* FILTER */}
              <SoftBox p={3}>
                <SoftTypography variant="h6">Jurnal Beban</SoftTypography>
                <Grid container spacing={2} mt={1.5} mb={2}>
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
                    <Button variant="contained" color="primary" fullWidth sx={{ mt: 2.5 }}>
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
                  columns={[...columns, { name: "aksi", label: "Aksi", align: "center" }]}
                  rows={tableRows}
                />
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

          {[
            "id_jurnal_beban",
            "id_beban",
            "tanggal",
            "kode",
            "nominal",
            "tipe_balance",
            "keterangan",
          ].map((field) => (
            <Box key={field} mb={2}>
              <SoftTypography variant="caption" fontWeight="medium">
                {field.toUpperCase()}
              </SoftTypography>
              <TextField
                fullWidth
                type={field === "tanggal" ? "date" : "text"}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              />
            </Box>
          ))}

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
    </DashboardLayout>
  );
}
