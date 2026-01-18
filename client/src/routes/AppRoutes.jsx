

// import { Routes, Route } from "react-router-dom";

// import Login from "../components/Login/Login";
// import Register from "../components/Register/Register";
// import Dashboard from "../components/Dashboard/Dashboard";
// import Coin from "../components/coin/coin";
// import ForgotPassword from "../components/ForgotPassword/ForgotPassword";
// import ProtectedRoute from "./ProtectedRoute";
// import Account from "../components/Account/Account";
// import Ad from "../components/side-ad/ad_page";
// import PrivacyPolicy from "../components/Footer/PrivacyPolicy";
// import TermsAndConditions from "../components/Footer/TermsAndConditions";
// import DashboardLayout from "../components/Dashboard/DashboardLayout";

// // import LinkShortener from "../components/Shortner/LinkShortener";
// // import AdPage from "../components/Shortner/AdPage";

// const AppRoutes = () => {
//   return (
//     <Routes>
//       {/* PUBLIC */}
//       <Route path="/ad" element={<Ad />} />
//       <Route path="/privacy-policy" element={<PrivacyPolicy />} />
//       <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
//       <Route element={<DashboardLayout />}/>

//       <Route path="/" element={<Dashboard />} />
//       <Route path="/home" element={<Dashboard />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />
//       <Route path="/forgot-password" element={<ForgotPassword />} />
//       {/* <Route path="/shortener" element={<LinkShortener />} />
//       <Route path="/ad/:code" element={<AdPage />} /> */}

//       {/* PROTECTED */}
//       <Route element={<ProtectedRoute />}>
//         <Route path="/coin" element={<Coin />} />
//         <Route path="/account" element={<Account />} />
//       </Route>
//     </Routes>
//   );
// };

// export default AppRoutes;



import { Routes, Route } from "react-router-dom";

import Login from "../components/Login/Login";
import Register from "../components/Register/Register";
import Dashboard from "../components/Dashboard/Dashboard";
import Coin from "../components/coin/coin";
import ForgotPassword from "../components/ForgotPassword/ForgotPassword";
import ProtectedRoute from "./ProtectedRoute";
import Account from "../components/Account/Account";
import Ad from "../components/side-ad/ad_page";
import PrivacyPolicy from "../components/Footer/PrivacyPolicy";
import TermsAndConditions from "../components/Footer/TermsAndConditions";

/* =====================================================
   🔧 CORRECTION 4:
   - Import DashboardLayout correctly
===================================================== */
import DashboardLayout from "../components/Dashboard/DashboardLayout";

const AppRoutes = () => {
  return (
    <Routes>
      {/* ================= PUBLIC ================= */}
      <Route path="/ad" element={<Ad />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

      {/* ================= NORMAL DASHBOARD ================= */}
      <Route path="/" element={<Dashboard />} />
      <Route path="/home" element={<Dashboard />} />

      {/* =====================================================
         🔧 CORRECTION 5 (MOST IMPORTANT):
         - Login/Register MUST be NESTED inside DashboardLayout
         - Otherwise Outlet will NOT work
         - This enables dashboard blur
      ===================================================== */}
      <Route element={<DashboardLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* ================= PROTECTED ================= */}
      <Route element={<ProtectedRoute />}>
        <Route path="/coin" element={<Coin />} />
        <Route path="/account" element={<Account />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
