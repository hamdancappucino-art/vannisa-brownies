const laporanPenjualanTableData = {
  columns: [
    { name: "tanggal", align: "left", label: "Tanggal" },
    { name: "kode", align: "left", label: "Kode" },
    { name: "nominal", align: "left", label: "Nominal" },
    { name: "tipe_balance", align: "left", label: "Tipe Balance" },
    { name: "keterangan", align: "left", label: "Keterangan" },
  ],

  rows: [
    {
      id_jurnal_penjualan: 1,
      id_penjualan: 101,
      tanggal: "2025-10-25",
      kode: "TRX001",
      nominal: 100000,              // dari total
      tipe_balance: "kredit",       // default
      keterangan: "Penjualan oleh Andi", // dari nama
      created_at: "2025-10-25 08:20:00",
    },
    {
      id_jurnal_penjualan: 2,
      id_penjualan: 102,
      tanggal: "2025-10-25",
      kode: "TRX002",
      nominal: 75000,
      tipe_balance: "kredit",
      keterangan: "Penjualan oleh Budi",
      created_at: "2025-10-25 08:35:00",
    },
  ],
};

export default laporanPenjualanTableData;
