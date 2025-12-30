// data/laporanLabaRugi.js

const laporanLabaRugiTable = {
  columns: [
    { name: "tanggal_awal", align: "left", label: "Tanggal Awal" },
    { name: "tanggal_akhir", align: "left", label: "Tanggal Akhir" },
    { name: "total_pendapatan", align: "left", label: "Total Pendapatan" },
    { name: "total_beban", align: "left", label: "Total Beban" },
    { name: "laba_kotor", align: "left", label: "Laba Kotor" },
    { name: "laba_bersih", align: "left", label: "Laba Bersih" },
    { name: "periode", align: "left", label: "Periode" },
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
