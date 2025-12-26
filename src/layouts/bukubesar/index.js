import API from "api/api";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Icon from "@mui/material/Icon";
import TextField from "@mui/material/TextField";

import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";

import tableDataBukuBesar from "./data/bukubesar";

import { useState, useEffect } from "react";

function BukuBesar() {
  const { columns } = tableDataBukuBesar;

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const [filter, setFilter] = useState({
    from: "",
    to: "",
    kode_akun: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/buku-besar");
        setRows(res.data);
      } catch (error) {
        console.error("Gagal fetch buku besar:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredRows = rows.filter((r) => {
    const matchKode =
      !filter.kode_akun || r.id_coa.toString().includes(filter.kode_akun);

    const matchFrom = !filter.from || r.tanggal >= filter.from;
    const matchTo = !filter.to || r.tanggal <= filter.to;

    return matchKode && matchFrom && matchTo;
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

  // Sort ASC by ID
  const sortedRows = [...filteredRows].sort((a, b) => a.id - b.id);

  // Pagination AFTER sorting
  const indexOfLastRow = page * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = sortedRows.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage));

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>

              <SoftBox p={3}>
                <SoftTypography variant="h6">Buku Besar</SoftTypography>

                <Grid container spacing={2} mb={2} alignItems="flex-end">

                  <Grid item xs={12} md={3}>
                    <SoftTypography fontSize="14px" fontWeight="medium">
                      Kode Akun
                    </SoftTypography>
                    <TextField
                      fullWidth
                      value={filter.kode_akun}
                      onChange={(e) =>
                        setFilter({ ...filter, kode_akun: e.target.value })
                      }
                    />
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <SoftTypography fontSize="14px" fontWeight="medium">
                      Tanggal Awal
                    </SoftTypography>
                    <TextField
                      type="date"
                      fullWidth
                      value={filter.from}
                      onChange={(e) =>
                        setFilter({ ...filter, from: e.target.value })
                      }
                    />
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <SoftTypography fontSize="14px" fontWeight="medium">
                      Tanggal Akhir
                    </SoftTypography>
                    <TextField
                      type="date"
                      fullWidth
                      value={filter.to}
                      onChange={(e) =>
                        setFilter({ ...filter, to: e.target.value })
                      }
                    />
                  </Grid>

                  <Grid item xs={12} md={1.5}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{ mt: { xs: 4, md: 4 }, color: "inherit" }}
                      onClick={() =>
                        setFilter({ from: "", to: "", kode_akun: "" })
                      }
                    >
                      <Icon sx={{ mr: 1, color: "white !important" }}>restart_alt</Icon>
                      <SoftTypography fontSize="13px" fontWeight="medium" color="white">
                        Reset
                      </SoftTypography>
                    </Button>
                  </Grid>

                </Grid>
              </SoftBox>

              <SoftBox>
                <Card>
                  {loading ? (
                    <SoftTypography p={3}>Loading...</SoftTypography>
                  ) : (
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
                          id: (
                            <SoftTypography variant="caption" color="text">
                              {r.id}
                            </SoftTypography>
                          ),
                          tanggal: (
                            <SoftTypography variant="caption" color="text">
                              {formatDate(r.tanggal)}
                            </SoftTypography>
                          ),
                          kode_akun: (
                            <SoftTypography variant="caption" color="text">
                              {r.kode_akun}
                            </SoftTypography>
                          ),
                          keterangan: (
                            <SoftTypography variant="caption" color="text">
                              {r.keterangan}
                            </SoftTypography>
                          ),
                          debit: (
                            <SoftTypography variant="caption" color="text">
                              {Number(r.debit).toLocaleString("id-ID")}
                            </SoftTypography>
                          ),
                          kredit: (
                            <SoftTypography variant="caption" color="text">
                              {Number(r.kredit).toLocaleString("id-ID")}
                            </SoftTypography>
                          ),
                          saldo: (
                            <SoftTypography variant="caption" color="text">
                              {Number(r.saldo).toLocaleString("id-ID")}
                            </SoftTypography>
                          ),
                          ref_transaksi: (
                            <SoftTypography variant="caption" color="text">
                              {r.ref_transaksi}
                            </SoftTypography>
                          ),
                          created_at: (
                            <SoftTypography variant="caption" color="text">
                              {formatDate(r.created_at)}
                            </SoftTypography>
                          ),
                        }))}
                      />
                    </SoftBox>
                  )}
                </Card>
              </SoftBox>
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

            </Card>
          </Grid>
        </Grid>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default BukuBesar;
