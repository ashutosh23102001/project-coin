

  import React, { useState, useEffect } from "react";
import "./Login.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../../API/axios";
import { useAuth } from "../../context/AuthContext";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [username, setUsername] = useState(""); // 🔴 FIXED (Username → username)
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  /* 🔔 SHOW LOGIN REQUIRED TOAST */
  useEffect(() => {
    if (location.state?.showLoginToast) {
      toast.warn("Please login first to access this page", {
        position: "top-center",
        autoClose: 2500,
      });
    }
  }, [location.state]);

  /* 🚀 HANDLE LOGIN */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const res = await api.post("/login", {
        // 🔴 CORRECTION: must match backend
        username: username.trim(),
        password: password,
      });

      console.log("LOGIN RESPONSE:", res.data);

      if (!res.data?.user) {
        throw new Error("Invalid server response");
      }

      // ✅ SAVE USER
      login(res.data.user);

      // ✅ REDIRECT
      const redirectTo = location.state?.from?.pathname || "/home";
      navigate(redirectTo, { replace: true });

      toast.success("Login successful 🎉");

    } catch (err) {
      console.error("LOGIN ERROR:", err);

      const msg =
        err.response?.data?.message ||
        err.message ||
        "Login failed";

      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="popup-overlay">
      {/* 🔴 TOAST CONTAINER REQUIRED */}
      <ToastContainer position="top-center" autoClose={2500} />

      <div className="popup-container">

        {/* LEFT */}
        <div className="left-side login-white-side">
          <h2>Login to your account</h2>

          {error && (
            <p style={{ color: "red", marginBottom: "10px" }}>
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="create-account-btn"
              disabled={loading}
            >
              {loading ? "LOGGING IN..." : "LOGIN"}
            </button>

            <p className="register-text">
              Don’t have an account?{" "}
              <Link to="/register">Register</Link>
            </p>
          </form>
        </div>

        {/* RIGHT */}
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