// import { Routes, Route } from "react-router-dom";
// import Login from "../components/Login/Login";
// import Dashboard from "../components/Dashboard/Dashboard";
// import Coin from "../components/coin/coin";
// import Register from "../components/Register/Register";
// import ProtectedRoute from "./ProtectedRoute";
// import Account from "../components/Account/Account";
// import LinkShortener from "../components/Shortner/LinkShortener";
// import AdPage from "../components/Shortner/AdPage"; // ✅ FIXED PATH


// const AppRoutes = () => {
//   return (
//     <Routes>
//       {/* PUBLIC */}
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />
//       <Route path="/" element={<Dashboard />} />
//       <Route path="/home" element={<Dashboard />} />
//       <Route path="/shortener" element={<LinkShortener />} />
//       <Route path="/ad/:code" element={<AdPage />} />


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

import ProtectedRoute from "./ProtectedRoute";
import Account from "../components/Account/Account";

import LinkShortener from "../components/Shortner/LinkShortener";
import AdPage from "../components/Shortner/AdPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<Dashboard />} />
      <Route path="/home" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/shortener" element={<LinkShortener />} />
      <Route path="/ad/:code" element={<AdPage />} />

      {/* PROTECTED */}
      <Route element={<ProtectedRoute />}>
        <Route path="/coin" element={<Coin />} />
        <Route path="/account" element={<Account />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
