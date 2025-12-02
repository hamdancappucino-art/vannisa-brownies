const pelangganData = {
  columns: [
    { name: "id_pelanggan", label: "No", align: "center" },
    { name: "nama", label: "Nama Pelanggan", align: "center" },
    { name: "alamat", label: "Alamat", align: "center" },
    { name: "no_telp", label: "No. Telp", align: "center" },
    { name: "email", label: "Email", align: "center" },
    { name: "tanggal", label: "Tanggal", align: "center" }
  ],

  rows: [
    {
      id_pelanggan: 1,
      nama: "Tono",
      alamat: "Jl. Mawar 1",
      no_telp: "08123456789",
      email: "Tono@gmail.com",
      created_at: "2025-01-01",
      updated_at: null
    },
    {
      id_pelanggan: 2,
      nama: "Siti",
      alamat: "Jl. Melati 2",
      no_telp: "08234567890",
      email: "Siti@gmail.com",
      created_at: "2025-02-01",
      updated_at: null
    }
  ]
};

export default pelangganData;
