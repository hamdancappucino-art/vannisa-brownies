/**
  All of the routes for the Vanissa Brownies are added here.
  You can add a new route, customize the routes, and delete the routes here.
*/

// Vannisa Brownies layouts
import BebanOperasional from "layouts/bebanoperasional";
import BukuBesar from "layouts/bukubesar";
import Dashboard from "layouts/dashboard";
//laporan
import LaporanPenjualan from "layouts/laporan/penjualan";
import LaporanLabaRugi from "layouts/laporan/laba-rugi";

//jurnal
import JurnalPenjualan from "layouts/jurnal/penjualan"
import JurnalBeban from "layouts/jurnal/beban";
import JurnalDP from "layouts/jurnal/dp";

//master
import MasterCOA from "layouts/mastercoa";
import MasterProduk from "layouts/masterproduk";
import MasterPelanggan from "layouts/masterpelanggan";

import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import TransaksiInput from "layouts/transaksi/penjualan";
import UserManagement from "layouts/usermanagement";
import VerifikasiPenjualan from "layouts/transaksi/verifikasi";
// import SignUp from "layouts/authentication/sign-up";

import TransaksiDP from "layouts/transaksi/dp";
// import Produk from "layouts/produk";
import Office from "examples/Icons/Office";
import CustomerSupport from "examples/Icons/CustomerSupport";

// Vannisa Brownies icons
import Shop from "examples/Icons/Shop";
import Document from "examples/Icons/Document";
import CreditCard from "examples/Icons/CreditCard";
import Profilee from "examples/Icons/Profile";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    route: "/dashboard",
    icon: <Shop size="12px" />,
    component: <Dashboard />,
    noCollapse: true,
  },

  // ======= COLLAPSE: MASTER DATA =======
  {
    type: "collapse",
    name: "Master Data",
    key: "master-data",
    // icon: <Database size="12px" />,
    icon: <CreditCard size="12px" />,
    collapse: [
      {
        name: "Master Akun (COA)",
        key: "master-coa",
        route: "/master-data/coa",
        // icon: <Book size="12px" />, 
        // component: <TransaksiDP />, 
        icon: <CreditCard size="12px" />,
        component: <MasterCOA />,
        isChild: true
      },
      {
        name: "Master Produk",
        key: "master-produk",
        route: "/master-data/produk",
        // icon: <Box size="12px" />, 
        // component: <TransaksiDP />, 
        icon: <CreditCard size="12px" />,
        component: <MasterProduk />,
        isChild: true
      },
      {
        name: "Master Pelanggan",
        key: "master-pelanggan",
        route: "/master-data/pelanggan",
        // icon: <Users size="12px" />, 
        // component: <TransaksiDP />, 
        icon: <CreditCard size="12px" />,
        component: <MasterPelanggan />,
        isChild: true
      },
    ],
  },

  // ======= COLLAPSE: TRANSAKSI =======
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
        isChild: true
      },
      {
        name: "DP Pembayaran",
        key: "transaksi-dp",
        route: "/transaksi/dp",
        // icon: <Wallet size="12px" />,
        icon: <CreditCard size="12px" />,
        component: <TransaksiDP />,
        isChild: true
      },
      {
        name: "Verifikasi Penjualan",
        key: "transaksi-verifikasi",
        route: "/transaksi/verifikasi",
        // icon: <CheckCircle size="12px" />, 
        // component: <TransaksiDP />, 
        icon: <CreditCard size="12px" />,
        component: <VerifikasiPenjualan />,
        isChild: true
      }
    ],
  },

  // ======= COLLAPSE: LAPORAN =======
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
        isChild: true
      },
      {
        name: "Laporan Laba Rugi",
        key: "laporan-laba-rugi",
        route: "/laporan/laba-rugi",
        icon: <Document size="12px" />,
        component: <LaporanLabaRugi />,
        isChild: true
      },
      {
        name: "Buku Besar",
        key: "buku-besar",
        route: "/buku-besar",
        // component: <LaporanJurnal />,
        icon: <Document size="12px" />,
        component: <BukuBesar />,
        isChild: true
      },
    ],
  },

  {
    type: "collapse",
    name: "Jurnal",
    key: "jurnal",
    icon: <Document size="12px" />,
    collapse: [
      {
        type: "collapse",
        name: "Jurnal Penjualan",
        key: "jurnal-penjualan",
        route: "/jurnal/penjualan",
        icon: <Document size="12px" />,
        component: <JurnalPenjualan />,
        isChild: true
      },
      {
        name: "Jurnal Beban",
        key: "jurnal-beban",
        route: "/jurnal/beban",
        icon: <Document size="12px" />,
        component: <JurnalBeban />,
        isChild: true
      },
      {
        name: "Jurnal DP",
        key: "jurnal-dp",
        route: "/jurnal/dp",
        icon: <Document size="12px" />,
        component: <JurnalDP />,
        isChild: true
      }
    ],
  },
  {
    type: "collapse",
    name: "Beban Operasional",
    key: "beban-operasional",
    route: "/beban-operasional",
    // icon: <Calculator size="12px" />,
    // component: <TransaksiDP />, 
    icon: <CreditCard size="12px" />,
    component: <BebanOperasional />,
    noCollapse: true,
  },

  {
    type: "collapse",
    name: "User Management",
    key: "user-management",
    route: "/user-management",
    // component: <Profile />,
    icon: <CustomerSupport size="12px" />,
    component: <UserManagement />,
    noCollapse: true,
  },

  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    route: "/profile",
    icon: <Profilee size="12px" />,
    component: <Profile />,
    noCollapse: true,
  },

  {
    name: "Sign In",
    key: "sign-in",
    route: "/authentication/sign-in",
    icon: <Document size="12px" />,
    component: <SignIn />,
    noCollapse: true,
  },
];

export default routes;
