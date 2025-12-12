const laporanBebanTableData = {
  columns: [
    { name: "id_jurnal_beban", align: "center", label: "ID Jurnal" },
    { name: "id_beban", align: "center", label: "ID Beban" },
    { name: "tanggal", align: "center", label: "Tanggal" },
    { name: "kode", align: "center", label: "Kode" },
    { name: "nominal", align: "center", label: "Nominal" },
    { name: "tipe_balance", align: "center", label: "Tipe Balance" },
    { name: "keterangan", align: "center", label: "Keterangan" },
    { name: "created_at", align: "center", label: "Tanggal Dibuat" },
  ],

  rows: [
    {
      id_jurnal_beban: 1,
      id_beban: 1,
      tanggal: "2025-10-25",
      kode: "JR001",
      nominal: 120000,
      tipe_balance: "debit",
      keterangan: "Beban Listrik",
      created_at: "2025-10-25 08:30:00",
    },
    {
      id_jurnal_beban: 2,
      id_beban: 2,
      tanggal: "2025-10-28",
      kode: "JR002",
      nominal: 90000,
      tipe_balance: "debit",
      keterangan: "Beban Air",
      created_at: "2025-10-28 09:10:00",
    },
    {
      id_jurnal_beban: 3,
      id_beban: 3,
      tanggal: "2025-11-01",
      kode: "JR003",
      nominal: 45000,
      tipe_balance: "debit",
      keterangan: "ATK",
      created_at: "2025-11-01 11:45:00",
    },
  ],
};

export default laporanBebanTableData;
