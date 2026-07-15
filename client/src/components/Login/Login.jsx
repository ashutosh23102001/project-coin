

//   import React, { useState, useEffect } from "react";
// import "./Login.css";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import api from "../../API/axios";
// import { useAuth } from "../../context/AuthContext";

// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const Login = () => {
//   const [username, setUsername] = useState(""); // 🔴 FIXED (Username → username)
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   /* 🔔 SHOW LOGIN REQUIRED TOAST */
//   useEffect(() => {
//     if (location.state?.showLoginToast) {
//       toast.warn("Please login first to access this page", {
//         position: "top-center",
//         autoClose: 2500,
//       });
//     }
//   }, [location.state]);

//   /* 🚀 HANDLE LOGIN */
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (loading) return;

//     setError("");
//     setLoading(true);

//     try {
//       const res = await api.post("/login", {
//         // 🔴 CORRECTION: must match backend
//         username: username.trim(),
//         password: password,
//       });

//       console.log("LOGIN RESPONSE:", res.data);

//       if (!res.data?.user) {
//         throw new Error("Invalid server response");
//       }

//       // ✅ SAVE USER
//       login(res.data.user);

//       // ✅ REDIRECT
//       const redirectTo = location.state?.from?.pathname || "/home";
//       navigate(redirectTo, { replace: true });

//       toast.success("Login successful 🎉");

//     } catch (err) {
//       console.error("LOGIN ERROR:", err);

//       const msg =
//         err.response?.data?.message ||
//         err.message ||
//         "Login failed";

//       setError(msg);
//       toast.error(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="popup-overlay">
//       {/* 🔴 TOAST CONTAINER REQUIRED */}
//       <ToastContainer position="top-center" autoClose={2500} />

//       <div className="popup-container">

//         {/* LEFT */}
//         <div className="left-side login-white-side">
//           <h2>Login to your account</h2>

//           {error && (
//             <p style={{ color: "red", marginBottom: "10px" }}>
//               {error}
//             </p>
//           )}

//           <form onSubmit={handleSubmit}>
//             <div className="input-group">
//               <input
//                 type="text"
//                 placeholder="Username"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 required
//               />
//             </div>

//             <div className="input-group">
//               <input
//                 type="password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>

//             <button
//               type="submit"
//               className="create-account-btn"
//               disabled={loading}
//             >
//               {loading ? "LOGGING IN..." : "LOGIN"}
//             </button>

//             <p className="register-text">
//               Don’t have an account?{" "}
//               <Link to="/register">Register</Link>
//             </p>
//           </form>
//         </div>

//         {/* RIGHT */}
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


// import React, { useState, useEffect } from "react";
// import "./Login.css";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import api from "../../API/axios";
// import { useAuth } from "../../context/AuthContext";

// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const Login = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const { login } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   /* SHOW LOGIN REQUIRED MESSAGE */
//   useEffect(() => {
//     if (location.state?.showLoginToast) {
//       toast.warn("Please login first to access this page", {
//         position: "top-center",
//         marginTop: "20px",
//         autoClose: 2500,
//       });

//       navigate(location.pathname, {
//         replace: true,
//         state: {},
//       });
//     }
//   }, [location, navigate]);

//   /* LOGIN */
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (loading) return;

//     setError("");
//     setLoading(true);

//     try {
//       const res = await api.post("/login", {
//         username: username.trim(),
//         password: password.trim(),
//       });

//       if (!res.data.success || !res.data.user) {
//         throw new Error("Invalid login response");
//       }

//       login(res.data.user);

//       toast.success("Login successful 🎉", {
//         autoClose: 1200,
//       });

//       const redirectTo =
//         location.state?.from?.pathname || "/home";

//       setTimeout(() => {
//         navigate(redirectTo, {
//           replace: true,
//         });
//       }, 1200);

//     } catch (err) {

//       const message =
//         err.response?.data?.message ||
//         err.message ||
//         "Login failed";

//       setError(message);

//       toast.error(message);

//     } finally {

//       setLoading(false);

//     }
//   };

//   return (
//     <div className="popup-overlay">

//       <ToastContainer
//         position="top-center"
//         autoClose={2500}
//       />

//       <div className="popup-container">

//         <div className="left-side login-white-side">

//           <h2>Login to your account</h2>

//           {error && (
//             <p
//               style={{
//                 color: "red",
//                 marginBottom: "10px",
//               }}
//             >
//               {error}
//             </p>
//           )}

//           <form onSubmit={handleSubmit}>

//             <div className="input-group">

//               <input
//                 type="text"
//                 placeholder="Username"
//                 value={username}
//                 onChange={(e) =>
//                   setUsername(e.target.value)
//                 }
//                 required
//               />

//             </div>

//             <div className="input-group">

//               <input
//                 type="password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) =>
//                   setPassword(e.target.value)
//                 }
//                 required
//               />

//             </div>

//             <button
//               type="submit"
//               className="create-account-btn"
//               disabled={loading}
//             >
//               {loading
//                 ? "LOGGING IN..."
//                 : "LOGIN"}
//             </button>

//             <p className="register-text">
//               Don't have an account?{" "}
//               <Link to="/register">
//                 Register
//               </Link>
//             </p>

//           </form>

//         </div>

//         <div className="right-side login-colorful-side">

//           <Link to="/register">
//             <button className="signup-btn">
//               Sign Up
//             </button>
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
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  /* ================= STATE ================= */

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= SHOW LOGIN REQUIRED MESSAGE ================= */

  useEffect(() => {
    if (location.state?.showLoginToast) {
      toast.warn("Please login first to continue.");

      navigate(location.pathname, {
        replace: true,
        state: {},
      });
    }
  }, [location, navigate]);

  /* ================= LOGIN ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      toast.warn("Username and password are required");
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post("/login", {
        username: trimmedUsername,
        password: trimmedPassword,
      });

      if (!data.success) {
        toast.error(data.message || "Login failed");
        return;
      }

      login(data.user);

      toast.success(
        data.message || "Login successful 🎉"
      );

      setUsername("");
      setPassword("");

      const redirectTo =
        location.state?.from?.pathname || "/home";

      setTimeout(() => {
        navigate(redirectTo, {
          replace: true,
        });
      }, 1200);

    } catch (err) {
      if (err.response?.status === 401) {
        toast.error(
          err.response.data.message ||
            "Invalid username or password"
        );
      } else {
        toast.error(
          err.response?.data?.message ||
            "Unable to login"
        );
      }

      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="popup-overlay">

      <ToastContainer
        position="top-center"
        autoClose={2500}
        style={{ marginTop: "60px" }}
      />

      <div className="popup-container">

        {/* LEFT */}

        <div className="left-side login-white-side">

          <h2>Login to your account</h2>

          <form onSubmit={handleSubmit}>

            <div className="input-group">

              <input
                type="text"
                placeholder="Username"
                value={username}
                maxLength={30}
                autoComplete="username"
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                required
              />

            </div>

            <div className="input-group">

              <input
                type="password"
                placeholder="Password"
                value={password}
                autoComplete="current-password"
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />

            </div>

            <button
              type="submit"
              className="create-account-btn"
              disabled={loading}
            >
              {loading
                ? "LOGGING IN..."
                : "LOGIN"}
            </button>

            <p className="register-text">
              Don't have an account?{" "}
              <Link to="/register">
                Register
              </Link>
            </p>

          </form>

        </div>

        {/* RIGHT */}

        <div className="right-side login-colorful-side">
             <Link to="/">
            <button className="popup-close-btn">
              ×
            </button>
          </Link>
          <Link to="/register">
            <button className="signup-btn">
              Sign Up
            </button>
          </Link>

        </div>

      </div>

    </div>
  );
};

export default Login;