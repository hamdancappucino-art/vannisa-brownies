const laporanPenjualanTableData = {
  columns: [
    { name: "id_laporan", align: "center", label: "ID Laporan" },
    { name: "tanggal_awal", align: "center", label: "Tanggal Awal" },
    { name: "tanggal_akhir", align: "center", label: "Tanggal Akhir" },
    { name: "total_penjualan", align: "center", label: "Total Penjualan" },
    { name: "total_transaksi", align: "center", label: "Total Transaksi" },
    { name: "produk_terlaris", align: "center", label: "Produk Terlaris" },
    { name: "periode", align: "center", label: "Periode" },
    { name: "created_at", align: "center", label: "Tanggal Dibuat" },
  ],

  rows: [
    {
      id_laporan: "LPR001",
      tanggal_awal: "2025-10-01",
      tanggal_akhir: "2025-10-25",
      total_penjualan: 100000,
      total_transaksi: 12,
      produk_terlaris: "Brownies Coklat",
      periode: "Oktober 2025",
      created_at: "2025-10-26",
    },
    {
      id_laporan: "LPR002",
      tanggal_awal: "2025-10-01",
      tanggal_akhir: "2025-10-25",
      total_penjualan: 75000,
      total_transaksi: 8,
      produk_terlaris: "Brownies Keju",
      periode: "Oktober 2025",
      created_at: "2025-10-26",
    },
  ],
};

export default laporanPenjualanTableData;
