import React, { useState } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import api from "../../API/axios";

const Register = () => {
  const navigate = useNavigate();

  const [Username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  

  const createUser = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      await api.post("/register", {
        Username: Username.trim(),
        Password: password
      });

      alert("✅ User registered successfully");
      navigate("/login");
    } catch (err) {
      if (err.response?.status === 409) {
        setError("Username already exists");
      } else {
        setError(err.response?.data?.message || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">

        {/* LEFT SIDE */}
        <div className="left-side">
          <h2>Create new account</h2>

          {/* ERROR MESSAGE */}
          {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}

          <form onSubmit={createUser}>
            <div className="input-group">
              <i className="icon user-icon" />
              <input
                type="text"
                placeholder="Username"
                value={Username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            

            <div className="input-group">
              <i className="icon lock-icon" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="terms-checkbox">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                I read and agree to Terms & Conditions
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
            <button className="popup-close-btn">&times;</button>
          </Link>

          <h1>Hello World!</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>

          <button className="learn-more-btn">Learn More</button>

          <Link to="/login">
            <button className="login-page-btn">
              Login Page
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
