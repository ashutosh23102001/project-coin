

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
            
            <p className="register-text" id="FP_btn">
              <Link to="/forgot-password">
                Forgot Passward
              </Link>
            </p>

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