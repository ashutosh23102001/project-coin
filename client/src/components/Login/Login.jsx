

import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import api from "../../API/axios";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [Username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const res = await api.post("/login", {
        Username: Username.trim(),
        password
      });

      login(res.data.user);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="popup-overlay">
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
              <input
                type="text"
                placeholder="Username"
                value={Username}
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
          </form>
        </div>

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
