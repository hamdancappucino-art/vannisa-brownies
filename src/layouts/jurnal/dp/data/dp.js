const laporanDPTableData = {
  columns: [
    { name: "id_jurnal_dp", align: "center", label: "ID Jurnal" },
    { name: "id_dp", align: "center", label: "ID DP" },
    { name: "tanggal", align: "center", label: "Tanggal" },
    { name: "kode", align: "center", label: "Kode" },
    { name: "nominal", align: "center", label: "Nominal" },
    { name: "tipe_balance", align: "center", label: "Tipe Balance" },
    { name: "keterangan", align: "center", label: "Keterangan" },
    { name: "created_at", align: "center", label: "Tanggal Dibuat" },
  ],

  rows: [
    {
      id_jurnal_dp: "JRN001",
      id_dp: "DP001",
      tanggal: "2025-10-25",
      kode: "TRX001",
      nominal: 100000,
      tipe_balance: "Debit",
      keterangan: "Pembayaran pertama",
      created_at: "2025-10-26",
    },
    {
      id_jurnal_dp: "JRN002",
      id_dp: "DP002",
      tanggal: "2025-10-25",
      kode: "TRX002",
      nominal: 75000,
      tipe_balance: "Kredit",
      keterangan: "Pembayaran kedua",
      created_at: "2025-10-26",
    },
  ]
};

export default laporanDPTableData;
