import React from "react";
import { Outlet } from "react-router-dom";


import Dashboard from "./Dashboard"; 

const DashboardLayout = () => {
  return (
    <div style={{ position: "relative" }}>

      <Dashboard />

      
      <Outlet />
    </div>
  );
};

export default DashboardLayout;
