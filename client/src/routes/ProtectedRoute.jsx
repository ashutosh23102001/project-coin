// // src/routes/ProtectedRoute.jsx
// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const ProtectedRoute = () => {
//   const { user, loading } = useAuth();

//   if (loading) return <div>Loading...</div>;

//   return user ? <Outlet /> : <Navigate to="/login" replace />;
// };

// export default ProtectedRoute;   // 🔴 REQUIRED

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;

  /* =====================================================
     🔧 CORRECTION:
     - DO NOT use toast here
     - Just redirect with state
  ===================================================== */
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,           // where user came from
          showLoginToast: true      // 🔑 FLAG FOR LOGIN PAGE
        }}
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
