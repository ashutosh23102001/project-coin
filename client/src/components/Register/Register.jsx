
import React, { useState } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import api from "../../API/axios"; // ✅ USE SHARED AXIOS INSTANCE

const Register = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [Username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // ✅ CREATE USER
  const createUser = async (event) => {
    event.preventDefault();
    setError("");

    try {
      await api.post("/register", {
        Email: email,
        Username: Username,
        Password: password
      });

      alert("✅ User registered successfully");
      navigate("/login");
    } catch (err) {
      if (err.response?.status === 409) {
        setError("Username already exists");
      } else {
        setError("Registration failed");
      }
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">

        <div className="left-side">
          <h2>Create new account</h2>

          {/* 🔴 ERROR MESSAGE */}
          {error && <p style={{ color: "red" }}>{error}</p>}

          <form onSubmit={createUser}>
            <div className="input-group">
              <i className="icon user-icon" />
              <input
                type="text"
                placeholder="Username"
                required
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="input-group">
              <i className="icon email-icon" />
              <input
                type="email"
                placeholder="Email"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-group">
              <i className="icon lock-icon" />
              <input
                type="password"
                placeholder="Password"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="terms-checkbox">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                I read and agree to Terms & Conditions
              </label>
            </div>

            <button type="submit" className="create-account-btn">
              CREATE ACCOUNT
            </button>
          </form>
        </div>

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
