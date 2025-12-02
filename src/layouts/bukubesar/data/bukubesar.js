// pages/buku-besar/data/bukuBesar.js

const tableDataBukuBesar = {
  columns: [
    { name: "id", label:"ID", align: "center" },
    { name: "kode_akun", label:"Kode Akun", align: "center" },
    { name: "tanggal", label:"Tanggal", align: "center" },
    { name: "keterangan", label:"Keterangan", align: "center" },
    { name: "debit", label:"Debit", align: "center" },
    { name: "kredit", label:"Kredit", align: "center" },
    { name: "saldo", label:"Saldo", align: "center" },
    { name: "ref_transaksi", label: "Ref Transaksi", align: "center" },
    { name: "created_at", label: "Dibuat Tanggal", align: "center" },
  ],

  rows: [
    {
      id: 1,
      kode_akun: "1001",
      tanggal: "2025-11-01",
      keterangan: "Penjualan 101",
      debit: 0,
      kredit: 50000,
      saldo: 50000,
      ref_transaksi: "INV-101",
      created_at: "2025-11-01",
    },
    {
      id: 2,
      kode_akun: "1001",
      tanggal: "2025-11-02",
      keterangan: "Setoran",
      debit: 20000,
      kredit: 0,
      saldo: 70000,
      ref_transaksi: "TRX-2025-02",
      created_at: "2025-11-02",
    },
  ],
};

export default tableDataBukuBesar;
