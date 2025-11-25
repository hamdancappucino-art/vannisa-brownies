// data/laporanPenjualanTableData.js
import Icon from "@mui/material/Icon";
import SoftTypography from "components/SoftTypography";
import SoftBox from "components/SoftBox";   

const action = (
  <Icon sx={{ cursor: "pointer", fontWeight: "bold" }} fontSize="small">
    more_vert
  </Icon>
);

const laporanPenjualanTableData = {
  columns: [
    { name: "tanggal", align: "left" },
    { name: "kode", align: "left" },
    { name: "nama", align: "left" },
    { name: "total", align: "right" },
    { name: "action", align: "center" },
  ],

  rows: [
    {
      tanggal: (
        <SoftTypography variant="button" color="text" fontWeight="medium">
          2025-10-25
        </SoftTypography>
      ),
      kode: (
        <SoftTypography variant="button" color="text" fontWeight="medium">
          TRX001
        </SoftTypography>
      ),
      nama: (
        <SoftBox display="flex" alignItems="center">
          <SoftTypography variant="button" color="text" fontWeight="medium">
            Andi
          </SoftTypography>
        </SoftBox>
      ),
      total: (
        <SoftTypography variant="button" color="text" fontWeight="medium">
          Rp100.000
        </SoftTypography>
      ),
      action,
    },
    {
      tanggal: (
        <SoftTypography variant="button" color="text" fontWeight="medium">
          2025-10-25
        </SoftTypography>
      ),
      kode: (
        <SoftTypography variant="button" color="text" fontWeight="medium">
          TRX002
        </SoftTypography>
      ),
      nama: (
        <SoftBox display="flex" alignItems="center">
          <SoftTypography variant="button" color="text" fontWeight="medium">
            Budi
          </SoftTypography>
        </SoftBox>
      ),
      total: (
        <SoftTypography variant="button" color="text" fontWeight="medium">
          Rp75.000
        </SoftTypography>
      ),
      action,
    },
  ],
};

export default laporanPenjualanTableData;
