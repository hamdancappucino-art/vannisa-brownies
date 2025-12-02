const laporanPenjualanTableData = {
  columns: [
    { name: "id_jurnal_penjualan", align: "center", label: "ID Jurnal" },
    { name: "id_penjualan", align: "center", label: "ID Penjualan" },
    { name: "tanggal", align: "center", label: "Tanggal" },
    { name: "kode", align: "center", label: "Kode" },
    { name: "nominal", align: "center", label: "Nominal" },
    { name: "tipe_balance", align: "center", label: "Tipe Balance" },
    { name: "keterangan", align: "center", label: "Keterangan" },
    { name: "created_at", align: "center", label: "Tanggal Dibuat" },
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
