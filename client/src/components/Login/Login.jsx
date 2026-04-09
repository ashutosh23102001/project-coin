// import React, { useState ,useEffect} from "react";
// import "./Login.css";
// import { Link, useNavigate ,useLocation } from "react-router-dom";
// import api from "../../API/axios";
// import { useAuth } from "../../context/AuthContext";

// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const Login = () => {
//   const [Username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const { login } = useAuth();
//   const navigate = useNavigate();
//     const location = useLocation();

//  useEffect(() => {
//     if (location.state?.showLoginToast) {
//       toast.warn(" Please login first to access this page", {
//         position: "top-center",
//         autoClose: 2500,
//         theme: "light",
//         marginTop: "50px",

//       });
//     }
//   }, []);



//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (loading) return;

//     setError("");
//     setLoading(true);

//     try {
//       const res = await api.post("/login", {
//         Username: Username.trim(),
//         password,
//       });

//       login(res.data.user);
//       const redirectTo = location.state?.from?.pathname || "/home";

//       navigate(redirectTo, { replace: true });
//     } catch (err) {
//       setError(err.response?.data?.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="popup-overlay">
//           <ToastContainer  style={{ marginTop: "60px" }}/>

//       <div className="popup-container">
//         {/* LEFT SIDE */}
//         <div className="left-side login-white-side">
//           <h2>Login to your account</h2>

//           {/* ERROR MESSAGE */}
//           {error && (
//             <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>
//           )}

//           <form onSubmit={handleSubmit}>
//             <div className="input-group">
//               <span className="icon user-icon"></span>
//               <input
//                 type="text"
//                 placeholder="Username"
//                 value={Username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 required
//               />
//             </div>

//             <div className="input-group">
//               <span className="icon lock-icon"></span>
//               <input
//                 type="password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>
//             {/* Remember & Forgot */}
//             <div className="login-options">
//               <label className="remember-me">
//                 <input type="checkbox" />
//                 <span>Remember me</span>
//               </label>

//               <Link to="/forgot-password" className="forgot-link">
//                 Forgot password?
//               </Link>
//             </div>
//             <button
//               type="submit"
//               className="create-account-btn"
//               disabled={loading}
//             >
//               {loading ? "LOGGING IN..." : "LOGIN"}
//             </button>

//             {/* Register text */}
//             <p className="register-text">
//               Don’t have an account? <Link to="/register">Register</Link>
//             </p>
//           </form>
//         </div>

//         {/* RIGHT SIDE */}
//         <Link to="/">
//           <button className="popup-close-btn">&times;</button>
//         </Link>
//         <div className="right-side login-colorful-side">
//           <Link to="/register">
//             <button className="signup-btn">Sign Up</button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


import React, { useState, useEffect } from "react";
import "./Login.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../../API/axios";
import { useAuth } from "../../context/AuthContext";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [Username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  /* ============ SHOW LOGIN REQUIRED TOAST ============ */
  useEffect(() => {
    if (location.state?.showLoginToast) {
      toast.warn("Please login first to access this page", {
        position: "top-center",
        autoClose: 2500,
        theme: "light",
      });
    }
  }, [location.state]);

  // /* ============ HANDLE LOGIN ============ */
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (loading) return;

  //   setError("");
  //   setLoading(true);

  //   try {
  //     const res = await api.post("/login", {
  //       username: Username.trim(), // ✅ FIXED
  //       password,
  //     });

  //     if (!res.data?.user) {
  //       throw new Error("Invalid server response");
  //     }

  //     // ✅ save user in context
  //     login(res.data.user);

  //     // ✅ redirect after login
  //     const redirectTo = location.state?.from?.pathname || "/home";
  //     navigate(redirectTo, { replace: true });

  //     toast.success("Login successful 🎉");

  //   } catch (err) {
  //     console.error("LOGIN ERROR:", err);

  //     const msg =
  //       err.response?.data?.message ||
  //       err.message ||
  //       "Login failed";

  //     setError(msg);
  //     toast.error(msg);

  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (loading) return;

  setLoading(true);

  try {
    const res = await api.post("/login", {
      username: Username.trim(),
      password,
    });

    // 🔴 CORRECTION 6: ensure response exists
    if (!res.data?.user) {
      throw new Error("Invalid server response");
    }

    login(res.data.user);

    navigate("/home");

    toast.success("Login successful 🎉");

  } catch (err) {
    const msg =
      err.response?.data?.message ||
      err.message ||
      "Login failed";

    toast.error(msg);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="popup-overlay">
      <ToastContainer style={{ marginTop: "60px" }} />

      <div className="popup-container">
        {/* LEFT SIDE */}
        <div className="left-side login-white-side">
          <h2>Login to your account</h2>

          {/* ERROR MESSAGE */}
          {error && (
            <p style={{ color: "red", marginBottom: "10px" }}>
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <span className="icon user-icon"></span>
              <input
                type="text"
                placeholder="Username"
                value={Username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <span className="icon lock-icon"></span>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Remember & Forgot */}
            <div className="login-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>

              <Link to="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="create-account-btn"
              disabled={loading}
            >
              {loading ? "LOGGING IN..." : "LOGIN"}
            </button>

            {/* Register */}
            <p className="register-text">
              Don’t have an account?{" "}
              <Link to="/register">Register</Link>
            </p>
          </form>
        </div>

        {/* CLOSE BUTTON */}
        <Link to="/">
          <button className="popup-close-btn">&times;</button>
        </Link>

        {/* RIGHT SIDE */}
        <div className="right-side login-colorful-side">
          <Link to="/register">
            <button className="signup-btn">Sign Up</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
