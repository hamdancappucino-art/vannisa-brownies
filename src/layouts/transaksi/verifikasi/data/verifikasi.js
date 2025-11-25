const verifikasiPenjualanData = {
  columns: [
    { name: "id_penjualan", label: "No Invoice", align: "left" },
    { name: "tanggal_jual", label: "Tanggal", align: "left" },
    { name: "pelanggan", label: "Pelanggan", align: "left" },
    { name: "produk", label: "Produk", align: "left" },
    { name: "total_harga", label: "Total", align: "right" },
    { name: "status", label: "Status", align: "left" },
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
