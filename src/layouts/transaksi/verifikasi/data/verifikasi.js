const verifikasiPenjualanData = {
  columns: [
    { name: "id_penjualan", label: "No Invoice", align: "center" },
    { name: "tanggal_jual", label: "Tanggal", align: "center" },
    { name: "pelanggan", label: "Pelanggan", align: "center" },
    { name: "produk", label: "Produk", align: "center" },
    { name: "total_harga", label: "Total", align: "center" },
    { name: "status", label: "Status", align: "center" },
    { name: "aksi", label: "Aksi", align: "center" },
  ],

  rows: [
    {
      id_penjualan: 101,
      tanggal_jual: "2025-11-01",
      pelanggan: "Tono",
      produk: "Brownies Original",
      total_harga: 50000,
      metode_pembayaran: "Cash",
      diverifikasi: false,
      diverifikasi_oleh: null,
      tanggal_verifikasi: null,
    },
    {
      id_penjualan: 102,
      tanggal_jual: "2025-11-05",
      pelanggan: "Siti",
      produk: "Brownies Keju",
      total_harga: 60000,
      metode_pembayaran: "Transfer",
      diverifikasi: true,
      diverifikasi_oleh: "admin",
      tanggal_verifikasi: "2025-11-05",
    },
  ]
};

export default verifikasiPenjualanData;
