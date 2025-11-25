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

import { useState } from "react";

function BukuBesar() {
  const { columns, rows } = tableDataBukuBesar;

  const [filter, setFilter] = useState({
    from: "",
    to: "",
    kode_akun: "",
  });

  const filteredRows = rows.filter((r) => {
    const matchKode = !filter.kode_akun || r.kode_akun.includes(filter.kode_akun);
    const matchFrom = !filter.from || r.tanggal >= filter.from;
    const matchTo = !filter.to || r.tanggal <= filter.to;
    return matchKode && matchFrom && matchTo;
  });

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <SoftBox p={3}>
                <SoftTypography variant="h6">Buku Besar</SoftTypography>

                {/* Filter Section */}
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
                      <Icon sx={{ mr: 1, color: "white !important" }}>
                        restart_alt
                      </Icon>
                      <SoftTypography fontSize="13px" fontWeight="medium" color="white">
                        Reset
                      </SoftTypography>
                    </Button>
                  </Grid>
                </Grid>

                {/* Table Section */}
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
                      rows={filteredRows.map((r) => ({
                        tanggal: (
                          <SoftTypography variant="caption" color="text">
                            {r.tanggal}
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
                            {r.debit.toLocaleString("id-ID")}
                          </SoftTypography>
                        ),
                        kredit: (
                          <SoftTypography variant="caption" color="text">
                            {r.kredit.toLocaleString("id-ID")}
                          </SoftTypography>
                        ),
                        saldo: (
                          <SoftTypography variant="caption" color="text">
                            {r.saldo.toLocaleString("id-ID")}
                          </SoftTypography>
                        ),
                      }))}
                    />
                  </SoftBox>
                </Card>
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
