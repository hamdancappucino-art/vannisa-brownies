// pages/downpayment/data/downpayment.js

const tableDataDownPayment = {
  columns: [
    { name: "id", label: "No", align: "center" },
    { name: "kode_transaksi", label: "Kode Transaksi", align: "center" },
    { name: "nama_pelanggan", label: "Nama Pelanggan", align: "center" },
    { name: "no_telp", label: "No Telp", align: "center" },
    { name: "nama_produk", label: "Nama Produk", align: "center" },
    { name: "jumlah_barang", label: "Jumlah Barang", align: "center" },
    { name: "nominal_dp", label: "Nominal DP", align: "center" },
    { name: "tanggal_dp", label: "Tanggal DP", align: "center" },
    { name: "keterangan", label: "Keterangan", align: "center" },
    { name: "status", label: "Status", align: "center" },
    { name: "aksi", label: "Aksi", align: "center" },
  ],

  rows: [
    {
      no: 1,
      kode_transaksi: "DP-001",
      nama_pelanggan: "Andi",
      no_telp: "081268201991",
      nominal_dp: "150.000",
      tanggal_dp: "2025-11-10",
      keterangan: "DP 3 Brownies",
      status: "Belum Lunas",
      id_user: 1,
      aksi: "Pelunasan",
    },
    {
      no: 2,
      kode_transaksi: "DP-002",
      nama_pelanggan: "Budi",
      no_telp: "081268201191",
      nominal_dp: "200.000",
      tanggal_dp: "2025-11-11",
      keterangan: "DP 5 Brownies",
      status: "Belum Lunas",
      id_user: 3,
      aksi: "Pelunasan",
    },
  ],
};

export default tableDataDownPayment;
