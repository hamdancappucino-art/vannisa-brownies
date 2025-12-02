// coaTableData.js
const coaTableData = {
  columns: [
    { name: "kode_akun", label: "Kode Akun", align: "center" },
    { name: "nama_akun", label: "Nama Akun", align: "center" },
    { name: "header_akun", label: "Header Akun", align: "center" },
    { name: "tipe_balance", label: "Tipe Balance", align: "center" },
    { name: "is_active", label: "Aktif", align: "center" },
    { name: "tanggal", label: "Tanggal", align: "center" },
  ],

  rows: [
    {
      kode_akun: "1001",
      nama_akun: "Kas",
      header_akun: "Aset Lancar",
      tipe_balance: "Debit",
      is_active: true,
      created_at: "2025-01-01", 
      updated_at: "2025-09-01"
    },
    {
      kode_akun: "2001",
      nama_akun: "Hutang Usaha",
      header_akun: "Kewajiban",
      tipe_balance: "Kredit",
      is_active: true,
      created_at: "2025-02-01", 
      updated_at: null
    },
  ],
};

export default coaTableData;
