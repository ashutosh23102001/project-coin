
import React from "react";
import Right_ad from "../side-ad/Right_ad";
import Left_ad from "../side-ad/Left_ad";
import Home from "./Home";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
import Bottom_ad from "../side-ad/Bottom_ad";

/* =====================================================
   🔧 CORRECTION 1:
   - Import useAuth to check login state
===================================================== */
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {

  /* =====================================================
     🔧 CORRECTION 2:
     - Get logged-in user from auth context
  ===================================================== */
  const { user } = useAuth();

  return (
    <div>
      <Navbar />

      <Right_ad />
      <Home />
      <Footer />
      <Left_ad />

      {/* =================================================
         🔧 CORRECTION 3 (MAIN LOGIC):
         - Bottom ad ONLY shows when user is NOT logged in
         - When user logs in → ad disappears
      ================================================= */}
      {!user && <Bottom_ad />}
    </div>
  );
};

export default Dashboard;
