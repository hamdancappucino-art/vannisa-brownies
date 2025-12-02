import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import Table from "examples/Tables/Table";

import verifikasiPenjualanData from "./data/verifikasi";

import { useState } from "react";

function VerifikasiPenjualan() {
  const { columns } = verifikasiPenjualanData;
  const [rows, setRows] = useState(verifikasiPenjualanData.rows);

  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState(null);

  const openDetail = (row) => {
    setDetail(row);
    setOpen(true);
  };

  const verify = (row, ok) => {
    const user = "admin";

    setRows(prev =>
      prev.map(r =>
        r.id_penjualan === row.id_penjualan
          ? {
            ...r,
            diverifikasi: ok,
            diverifikasi_oleh: ok ? user : null,
            tanggal_verifikasi: ok ? new Date().toISOString() : null,
          }
          : r
      )
    );
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <SoftBox p={3}>
                <SoftTypography variant="h6" mb={2}>
                  Verifikasi Penjualan
                </SoftTypography>

              </SoftBox>

              <Card>
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
                    columns={columns}
                    rows={rows.map((r) => ({
                      id_penjualan: (
                        <SoftTypography variant="caption" color="text">
                          {"INV-" + r.id_penjualan}
                        </SoftTypography>
                      ),

                      tanggal_jual: (
                        <SoftTypography variant="caption" color="text">
                          {r.tanggal_jual}
                        </SoftTypography>
                      ),

                      pelanggan: (
                        <SoftTypography variant="caption" color="text">
                          {r.pelanggan}
                        </SoftTypography>
                      ),

                      produk: (
                        <SoftTypography variant="caption" color="text">
                          {r.produk}
                        </SoftTypography>
                      ),

                      total_harga: (
                        <SoftTypography variant="caption" color="text">
                          {r.total_harga.toLocaleString("id-ID")}
                        </SoftTypography>
                      ),

                      status: (
                        <SoftTypography variant="caption" color="text">
                          {r.diverifikasi
                            ? `Diverifikasi oleh ${r.diverifikasi_oleh}`
                            : "Pending"}
                        </SoftTypography>
                      ),

                      aksi: (
                        <>
                          <IconButton onClick={() => openDetail(r)}>
                            <VisibilityIcon />
                          </IconButton>

                          {!r.diverifikasi && (
                            <IconButton onClick={() => verify(r, true)}>
                              <CheckIcon color="success" />
                            </IconButton>
                          )}

                          {r.diverifikasi && (
                            <IconButton onClick={() => verify(r, false)}>
                              <CloseIcon color="error" />
                            </IconButton>
                          )}
                        </>
                      ),
                    }))}
                  />
                </SoftBox>
              </Card>
            </Card>
          </Grid>
        </Grid>
      </SoftBox>

      {/* DETAIL MODAL */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            width: 560,
            p: 3,
            bgcolor: "background.paper",
            mx: "auto",
            mt: "10vh",
            borderRadius: 2,
          }}
        >
          <SoftTypography variant="h5" mb={2}>
            Detail Penjualan
          </SoftTypography>

          {detail && (
            <SoftBox>
              <div><strong>Invoice:</strong> {"INV-" + detail.id_penjualan}</div>
              <div><strong>Pelanggan:</strong> {detail.pelanggan}</div>
              <div><strong>Produk:</strong> {detail.produk}</div>
              <div><strong>Total:</strong> {detail.total_harga}</div>
              <div><strong>Status:</strong> {detail.diverifikasi ? `Diverifikasi oleh ${detail.diverifikasi_oleh}` : "Pending"}</div>
            </SoftBox>
          )}

          <SoftBox mt={3} display="flex" justifyContent="flex-end">
            <Button onClick={() => setOpen(false)}>Tutup</Button>
          </SoftBox>
        </Box>
      </Modal>

      <Footer />
    </DashboardLayout>
  );
}

export default VerifikasiPenjualan;
