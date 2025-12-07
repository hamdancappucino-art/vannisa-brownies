import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // ⬅️ WAJIB

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Hapus data login
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Hapus header Authorization
    delete axios.defaults.headers.common["Authorization"];

    // Redirect ke halaman login
    navigate("/authentication/sign-in", { replace: true });
  }, []);

  return null; // Tidak menampilkan apa-apa
}

export default Logout;
