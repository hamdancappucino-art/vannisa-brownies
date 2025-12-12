const bebanTableData = {
  columns: [
    { name: "id", label: "No", align: "center" },
    { name: "jenis_beban", label: "Jenis Beban", align: "center" },
    { name: "kode_akun", label: "Kode Akun", align: "center" },
    { name: "nominal", label: "Nominal", align: "center" },
    { name: "tanggal_beban", label: "Tanggal Beban", align: "center" },
    { name: "keterangan", label: "Keterangan", align: "center" },
    { name: "id_user", label: "Id User", align: "center" },
    { name: "created_at", label: "Terakhir Diubah", align: "center" },
  ],

  rows: [
    {
      id: 1,
      jenis_beban: "Listrik",
      kode_akun: "5101",
      nominal: 350000,
      tanggal_beban: "2025-01-10",
      keterangan: "Pembayaran listrik bulanan",
      id_user: 1,
      created_at: "2025-01-10 09:21:00",
    },
    {
      id: 2,
      jenis_beban: "Air",
      kode_akun: "5102",
      nominal: 150000,
      tanggal_beban: "2025-01-11",
      keterangan: "Pembayaran air",
      id_user: 2,
      created_at: "2025-01-11 14:02:00",
    },
  ],
};

export default bebanTableData;
