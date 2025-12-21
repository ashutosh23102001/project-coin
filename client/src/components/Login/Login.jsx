
// part 3

import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import api from "../../API/axios";
import { useAuth } from "../../context/AuthContext"; // ✅ ADD

const Login = () => {
  const [Username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ ADD

  function handleSubmit(event) {
    event.preventDefault();

    api.post("/users", { Username, password })
      .then((res) => {
        console.log(res.data); // { message, user }

        if (res.data.message === "login successful") {
          setLoginStatus(res.data.message);

          // ✅ ADD THIS (AuthContext login)
          login(res.data.user);

          // ✅ redirect after successful login
          navigate("/coin");
        } else {
          setLoginStatus("Invalid username or password");
        }
      })
      .catch((err) => {
        console.error(err);
        setLoginStatus("Server error");
      });
  }

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="left-side login-white-side">
          <h2>Login to your account</h2>

          <form className="action">
            <span className="login-status">{loginStatus}</span>
          </form>

          <form onSubmit={handleSubmit}>
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

            <div>
              <a>Forgot password ?</a>
            </div>

            <button type="submit" className="create-account-btn">
              LOGIN
            </button>
          </form>
        </div>

        <div className="right-side login-colorful-side">
          <Link to={"/"}>
            <button className="popup-close-btn">&times;</button>
          </Link>

          <div className="center-content">
            <h1>Hello World!</h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>

            <Link to={"/register"}>
              <button className="signup-btn">Sign Up</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
