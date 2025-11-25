// pages/buku-besar/data/bukuBesar.js

const tableDataBukuBesar = {
  columns: [
    { name: "tanggal", label:"Tanggal", align: "center" },
    { name: "kode_akun", label:"Kode Akun", align: "center" },
    { name: "keterangan", label:"Keterangan", align: "center" },
    { name: "debit", label:"Debit", align: "center" },
    { name: "kredit", label:"Kredit", align: "center" },
    { name: "saldo", label:"Saldo", align: "center" },
  ],

  rows: [
    {
      tanggal: "2025-11-01",
      kode_akun: "1001",
      keterangan: "Penjualan 101",
      debit: 0,
      kredit: 50000,
      saldo: 50000,
    },
    {
      tanggal: "2025-11-02",
      kode_akun: "1001",
      keterangan: "Setoran",
      debit: 20000,
      kredit: 0,
      saldo: 70000,
    },
  ],
};

export default tableDataBukuBesar;
