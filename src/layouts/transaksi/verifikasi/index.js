import { useEffect, useState } from "react";
import API from "api/api";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
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
import CustomDialog from "components/CustomDialog";

import Table from "examples/Tables/Table";

import verifikasiPenjualanData from "./data/verifikasi";

function VerifikasiPenjualan() {
  const { columns } = verifikasiPenjualanData;
  const [rows, setRows] = useState([]);

  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.username || "admin";

  // Pagination
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const [dialog, setDialog] = useState({
    open: false,
    title: "",
    subtitle: "",
    type: "success",
  });

  function showDialog(title, subtitle, type = "error") {
    setDialog({
      open: true,
      title,
      subtitle,
      type,
    });
  }

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await API.get("/transaksi-penjualan");

      const mapped = res.data
        .map((t) => ({
          ...t,
          id_penjualan: t.id_transaksi,
          diverifikasi: t.status === "diverifikasi",
          diverifikasi_oleh:
            t.status === "diverifikasi" ? t.diverifikasi_oleh || username : null,
        }))
        .sort((a, b) => a.id_penjualan - b.id_penjualan);

      setRows(mapped);
    } catch (err) {
      console.log(err);
    }
  };

  const openDetail = (row) => {
    setDetail(row);
    setOpen(true);
  };

  const verify = async (row, yes) => {
    try {
      await API.put(`/transaksi-penjualan/${row.id_transaksi}`, {
        id_kasir: row.id_kasir,
        id_produk: row.id_produk,
        id_pelanggan: row.id_pelanggan,
        tanggal_jual: row.tanggal_jual,
        jumlah_barang: row.jumlah_barang,
        metode_pembayaran: row.metode_pembayaran,
        status: yes ? "diverifikasi" : "pending",
        diverifikasi_oleh: yes ? username : null,
      });

      loadData();

      showDialog(
        "Berhasil",
        yes
          ? `Transaksi INV-${row.id_penjualan} berhasil diverifikasi`
          : `Verifikasi transaksi INV-${row.id_penjualan} dibatalkan`,
        "success"
      );
    } catch (err) {
      showDialog(
        "Gagal",
        err.response?.data?.message || "Gagal memperbarui status penjualan",
        "error"
      );
    }
  };

  // Pagination logic
  const indexOfLastRow = page * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = rows.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.max(1, Math.ceil(rows.length / rowsPerPage));

  const formatTanggal = (isoString) => {
    if (!isoString) return "";
    return isoString.split("T")[0];
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
                    rows={currentRows.map((r) => ({
                      id_penjualan: (
                        <SoftTypography variant="caption" color="text">
                          {"INV-" + r.id_penjualan}
                        </SoftTypography>
                      ),

                      tanggal_jual: (
                        <SoftTypography variant="caption" color="text">
                          {formatTanggal(r.tanggal_jual)}
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
                          {"Rp " + r.total_harga.toLocaleString("id-ID")}
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

                  {/* PAGINATION */}
                  <SoftBox
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    p={2}
                    gap={2}
                  >
                    <Button
                      variant="outlined"
                      disabled={page === 1 || rows.length === 0}
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
                      disabled={page === totalPages || rows.length === 0}
                      onClick={() => setPage(page + 1)}
                    >
                      <SoftTypography fontSize="13px" fontWeight="medium" color="black">
                        Next
                      </SoftTypography>
                    </Button>
                  </SoftBox>
                </SoftBox>
              </Card>
            </Card>
          </Grid>
        </Grid>
      </SoftBox>

      {/* MODAL DETAIL */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 560,
            p: 3,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
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
              <div>
                <strong>Status:</strong>{" "}
                {detail.diverifikasi
                  ? `Diverifikasi oleh ${detail.diverifikasi_oleh}`
                  : "Pending"}
              </div>
            </SoftBox>
          )}

          <SoftBox mt={3} display="flex" justifyContent="flex-end">
            <Button onClick={() => setOpen(false)}>Tutup</Button>
          </SoftBox>
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

export default VerifikasiPenjualan;
