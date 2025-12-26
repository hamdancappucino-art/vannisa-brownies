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
};

export default tableDataBukuBesar;
