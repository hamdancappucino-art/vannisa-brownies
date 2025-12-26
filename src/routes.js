import { useMemo } from "react";

// Layouts
import BebanOperasional from "layouts/bebanoperasional";
import BukuBesar from "layouts/bukubesar";
import Dashboard from "layouts/dashboard";

// laporan
import LaporanPenjualan from "layouts/laporan/penjualan";
import LaporanLabaRugi from "layouts/laporan/laba-rugi";

// jurnal
import JurnalPenjualan from "layouts/jurnal/penjualan";
import JurnalBeban from "layouts/jurnal/beban";
import JurnalDP from "layouts/jurnal/dp";

// master
import MasterCOA from "layouts/mastercoa";
import MasterProduk from "layouts/masterproduk";
import MasterPelanggan from "layouts/masterpelanggan";

import Profile from "layouts/profile";
import Logout from "layouts/authentication/logout";
import SignIn from "layouts/authentication/sign-in";
import TransaksiInput from "layouts/transaksi/penjualan";
import UserManagement from "layouts/usermanagement";
import VerifikasiPenjualan from "layouts/transaksi/verifikasi";
import TransaksiDP from "layouts/transaksi/dp";

// Icons
import Shop from "examples/Icons/Shop";
import Document from "examples/Icons/Document";
import CreditCard from "examples/Icons/CreditCard";
import Profilee from "examples/Icons/Profile";
import Master from "examples/Icons/Master";
import CustomerSupport from "examples/Icons/CustomerSupport";
import LogoutIcon from "examples/Icons/Logout";
import JurnalUmum from "layouts/jurnal/umum";
// import { type } from "@testing-library/user-event/dist/types/utility";

const getRole = () => {
  try {
    const u = JSON.parse(localStorage.getItem("user") || "{}");
    return u.role || null;
  } catch {
    return null;
  }
};

const accessControl = {
  kasir: [
    "dashboard",
    "transaksi-penjualan",
    "transaksi-dp",
    "profile",
    "logout",
  ],
  staff_keuangan: [
    "dashboard",
    "transaksi-verifikasi",
    "beban-operasional",
    "master-data",
    "master-coa",
    "master-produk",
    "master-pelanggan",
    "jurnal-umum",
    // "jurnal-penjualan",
    // "jurnal-beban",
    // "jurnal-dp",
    "laporan",
    "laporan-penjualan",
    "laporan-laba-rugi",
    "buku-besar",
    "profile",
    "logout",
  ],
  admin: "all",
  owner: "all",
};

function isAllowed(key) {
  const role = getRole();

  if (key === "sign-in") return true;
  if (key === "logout") return true;

  if (!role) return false;

  const allowed = accessControl[role];

  if (!allowed) return false;

  if (allowed === "all") return true;

  return allowed.includes(key);
}

const rawRoutes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    route: "/dashboard",
    icon: <Shop size="12px" />,
    component: <Dashboard />,
    protected: true,
    noCollapse: true,
  },

  // MASTER
  {
    type: "collapse",
    name: "Master Data",
    key: "master-data",
    icon: <Master size="12px" />,
    collapse: [
      {
        name: "Master Akun (COA)",
        key: "master-coa",
        route: "/master-data/coa",
        icon: <Master size="12px" />,
        component: <MasterCOA />,
        protected: true,
      },
      {
        name: "Master Produk",
        key: "master-produk",
        route: "/master-data/produk",
        icon: <Master size="12px" />,
        component: <MasterProduk />,
        protected: true,
      },
      {
        name: "Master Pelanggan",
        key: "master-pelanggan",
        route: "/master-data/pelanggan",
        icon: <Master size="12px" />,
        component: <MasterPelanggan />,
        protected: true,
      },
    ],
  },

  // TRANSAKSI
  {
    type: "collapse",
    name: "Transaksi",
    key: "transaksi",
    icon: <CreditCard size="12px" />,
    collapse: [
      {
        name: "Input Penjualan",
        key: "transaksi-penjualan",
        route: "/transaksi/penjualan",
        icon: <CreditCard size="12px" />,
        component: <TransaksiInput />,
        protected: true,
      },
      {
        name: "DP Pembayaran",
        key: "transaksi-dp",
        route: "/transaksi/dp",
        icon: <CreditCard size="12px" />,
        component: <TransaksiDP />,
        protected: true,
      },
      {
        name: "Verifikasi Penjualan",
        key: "transaksi-verifikasi",
        route: "/transaksi/verifikasi",
        icon: <CreditCard size="12px" />,
        component: <VerifikasiPenjualan />,
        protected: true,
      },
    ],
  },

  {
    type: "collapse",
    name: "Beban Operasional",
    key: "beban-operasional",
    route: "/beban-operasional",
    icon: <CreditCard size="12px" />,
    component: <BebanOperasional />,
    protected: true,
    noCollapse: true,
  },

  // JURNAL
  {
    type: "collapse",
    name: "Jurnal Umum",
    key: "jurnal-umum",
    route: "/jurnal-umum",
    icon: <Document size="12px" />,
    component: <JurnalUmum />,
    protected: true,
    noCollapse: true,
  },
  // {
  //   type: "collapse",
  //   name: "Jurnal",
  //   key: "jurnal",
  //   icon: <Document size="12px" />,
  //   collapse: [
  //     {
  //       name: "Jurnal Penjualan",
  //       key: "jurnal-penjualan",
  //       route: "/jurnal/penjualan",
  //       icon: <Document size="12px" />,
  //       component: <JurnalPenjualan />,
  //       protected: true,
  //     },
  //     {
  //       name: "Jurnal Beban",
  //       key: "jurnal-beban",
  //       route: "/jurnal/beban",
  //       icon: <Document size="12px" />,
  //       component: <JurnalBeban />,
  //       protected: true,
  //     },
  //     {
  //       name: "Jurnal DP",
  //       key: "jurnal-dp",
  //       route: "/jurnal/dp",
  //       icon: <Document size="12px" />,
  //       component: <JurnalDP />,
  //       protected: true,
  //     },
  //   ],
  // },

  // LAPORAN
  {
    type: "collapse",
    name: "Laporan",
    key: "laporan",
    icon: <Document size="12px" />,
    collapse: [
      {
        name: "Laporan Penjualan",
        key: "laporan-penjualan",
        route: "/laporan/penjualan",
        icon: <Document size="12px" />,
        component: <LaporanPenjualan />,
        protected: true,
      },
      {
        name: "Laporan Laba Rugi",
        key: "laporan-laba-rugi",
        route: "/laporan/laba-rugi",
        icon: <Document size="12px" />,
        component: <LaporanLabaRugi />,
        protected: true,
      },
      {
        name: "Buku Besar",
        key: "buku-besar",
        route: "/laporan/buku-besar",
        icon: <Document size="12px" />,
        component: <BukuBesar />,
        protected: true,
      },
    ],
  },

  {
    type: "collapse",
    name: "User Management",
    key: "user-management",
    route: "/user-management",
    icon: <CustomerSupport size="12px" />,
    component: <UserManagement />,
    protected: true,
    noCollapse: true,
  },

  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    route: "/profile",
    icon: <Profilee size="12px" />,
    component: <Profile />,
    protected: true,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Logout",
    key: "logout",
    route: "/logout",
    icon: <LogoutIcon size="12px" />,
    component: <Logout />,
    noCollapse: true,
  },

  // ALWAYS ALLOWED
  {
    name: "Sign In",
    key: "sign-in",
    route: "/authentication/sign-in",
    icon: <Document size="12px" />,
    component: <SignIn />,
    noCollapse: true,
  },
];

export const useFilteredRoutes = () => {
  return useMemo(() => {
    return rawRoutes
      .map((item) => {
        if (item.key === "sign-in") return item;

        if (!isAllowed(item.key)) {
          if (item.collapse) {
            const filteredChildren = item.collapse.filter((child) =>
              isAllowed(child.key)
            );
            if (filteredChildren.length > 0) {
              return { ...item, collapse: filteredChildren };
            }
          }
          return null;
        }
        return item;
      })
      .filter(Boolean);
  }, [localStorage.getItem("user")]);
};

export const allRoutes = rawRoutes;
