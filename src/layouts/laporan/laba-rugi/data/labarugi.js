// data/laporanLabaRugi.js

const laporanLabaRugiTable = {
  columns: [
    { name: "id_laporan", align: "center", label: "ID Laporan" },
    { name: "tanggal_awal", align: "center", label: "Tanggal Awal" },
    { name: "tanggal_akhir", align: "center", label: "Tanggal Akhir" },
    { name: "total_pendapatan", align: "center", label: "Total Pendapatan" },
    { name: "total_beban", align: "center", label: "Total Beban" },
    { name: "laba_kotor", align: "center", label: "Laba Kotor" },
    { name: "laba_bersih", align: "center", label: "Laba Bersih" },
    { name: "periode", align: "center", label: "Periode" },
    { name: "created_at", align: "center", label: "Tanggal Dibuat" },
  ],

  rows: [
    {
      id_laporan: "LR001",
      tanggal_awal: "2025-01-01",
      tanggal_akhir: "2025-01-31",
      total_pendapatan: 12000000,
      total_beban: 7000000,
      laba_kotor: 5000000,
      laba_bersih: 4800000,
      periode: "Januari 2025",
      created_at: "2025-02-01",
    },
  ],
};

export default laporanLabaRugiTable;
