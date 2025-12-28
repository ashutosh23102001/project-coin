import { Routes, Route } from "react-router-dom";
import Login from "../components/Login/Login";
import Dashboard from "../components/Dashboard/Dashboard";
import Coin from "../components/coin/coin";
import Register from "../components/Register/Register";
import ProtectedRoute from "./ProtectedRoute";
import Account from "../components/Account/Account";

const AppRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/home" element={<Dashboard />} />

      {/* PROTECTED */}
      <Route element={<ProtectedRoute />}>
        <Route path="/coin" element={<Coin />} />
        <Route path="/account" element={<Account />} />

      </Route>
    </Routes>
  );
};

export default AppRoutes;