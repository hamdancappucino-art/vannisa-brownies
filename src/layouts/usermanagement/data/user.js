const userTableData = {
  columns: [
    { name: "id", label: "No", align: "center" },
    { name: "username", label: "Username", align: "center" },
    { name: "password", label: "Password", align: "center" },
    { name: "nama_lengkap", label: "Nama Lengkap", align: "center" },
    { name: "email", label: "Email", align: "center" },
    { name: "no_telp", label: "No Telp", align: "center" },
    { name: "role", label: "Role", align: "center" },
    { name: "is_active", label: "Status", align: "center" },
    { name: "aksi", label: "Aksi", align: "center" },
  ],

  rows: [
    {
      id: 1,
      username: "admin",
      password: "admin121",
      nama_lengkap: "Admin",
      email: "admin@local",
      no_telp: "081928817721",
      role: "admin",
      is_active: true,
    },
    {
      id: 2,
      username: "kasir",
      password: "kasir121",
      nama_lengkap: "Kasir 1",
      email: "kasir1@local",
      no_telp: "081928817721",
      role: "kasir",
      is_active: true,
    },
  ],
};

export default userTableData;
