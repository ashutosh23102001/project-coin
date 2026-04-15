

import React, { useState, useEffect } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import api from "../../API/axios";
import { FaArrowsDownToPeople } from "react-icons/fa6";

/* =====================================================
   🔧 CORRECTION 1: Toastify imports (already present)
===================================================== */
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= READ REF FROM URL ================= */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) setReferralCode(ref);
  }, []);

  /* ================= REGISTER ================= */
  const createUser = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!username.trim() || !password) {
      toast.warn("⚠️ Username and password are required", {
        position: "top-center",
      });
      return;
    }

    setLoading(true);

    try {
      /* =================================================
         🔧 CORRECTION 2:
         - READ RESPONSE instead of assuming success
      ================================================= */
      const res = await api.post("/register", {
        username: username.trim(),
        password,
        referralCode: referralCode || null,
      });

      /* =================================================
         🔧 CORRECTION 3:
         - STOP if backend says success=false
      ================================================= */
      if (!res.data?.success) {
        toast.error(res.data?.message || "❌ Registration failed", {
          position: "top-center",
        });
        return; // ⛔ STOP — NO REDIRECT
      }

      /* ================= REAL SUCCESS ================= */
      toast.success("✅ Account created successfully!", {
        position: "top-center",
        autoClose: 2000,
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      /* =================================================
         🔧 CORRECTION 4:
         - HANDLE DATABASE / HTTP ERRORS
      ================================================= */
      if (err.response?.status === 409) {
        toast.error("❌ Username already exists", {
          position: "top-center",
        });
      } else {
        toast.error(
          err.response?.data?.message || "❌ Registration failed",
          { position: "top-center" }
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="popup-overlay">
      {/* =================================================
         🔧 CORRECTION 5:
         - ToastContainer (already present)
         - marginTop preserved
      ================================================= */}
      <ToastContainer
        position="top-center"
        style={{ marginTop: "60px" }}
      />

      <div className="popup-container">
        {/* LEFT SIDE */}
        <div className="left-side">
          <h2>Create new account</h2>

          <form onSubmit={createUser}>
            <div className="input-group">
              <i className="icon user-icon"></i>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <i className="icon lock-icon"></i>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <FaArrowsDownToPeople />
              <input
                placeholder="Referral Code (optional)"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
              />
            </div>

            <div className="terms-checkbox">
              <input type="checkbox" required />
              <label>
                I agree to{" "}
                <a href="/terms-and-conditions">Terms & Conditions</a>
              </label>
            </div>

            <button
              type="submit"
              className="create-account-btn"
              disabled={loading}
            >
              {loading ? "CREATING..." : "CREATE ACCOUNT"}
            </button>
          </form>
        </div>

        {/* RIGHT SIDE */}
        <div className="right-side">
          <Link to="/">
            <button className="popup-close-btn">×</button>
          </Link>

          <h1>Welcome!</h1>
          <p>Create account & earn rewards</p>

          <Link to="/login">
            <button className="login-page-btn">Login</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
