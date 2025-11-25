// coaTableData.js
const produkTableData = {
  columns: [
    { name: "id_produk", label: "No", align: "center" },
    { name: "nama_produk", label: "Nama Produk", align: "center" },
    { name: "kategori", label: "Kategori", align: "center" },
    { name: "harga_jual", label: "Harga Jual", align: "center" },
    { name: "stok", label: "Stok", align: "center" },
    { name: "satuan", label: "Satuan", align: "center" },
  ],

  rows: [
    { id_produk: 1, nama_produk: "Brownies Original", kategori: "Kue", harga_jual: 25000, stok: 20, satuan: "pcs" },
    { id_produk: 2, nama_produk: "Brownies Keju", kategori: "Kue", harga_jual: 30000, stok: 10, satuan: "pcs" },
  ],
};

export default produkTableData;
