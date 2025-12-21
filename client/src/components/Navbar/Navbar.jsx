import React, { useState } from "react";
import "./Navbar.css";
import logo from "../assets/coin.png";
import { Link, useNavigate } from "react-router-dom";
import { RiAccountCircleLine } from "react-icons/ri";
import { useAuth } from "../../context/AuthContext";
import api from "../../API/axios";

const Navbar = () => {
  const navigate = useNavigate();

  // ✅ SEPARATE STATES
  const [pagesOpen, setPagesOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await api.post("/logout");
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">

        {/* LOGO */}
        <div className="logo">
          <img src={logo} alt="logo" className="logo-icon" />
        </div>

        {/* NAV LINKS */}
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li
            className="dropdown"
            onMouseEnter={() => setPagesOpen(true)}
            onMouseLeave={() => setPagesOpen(false)}
          >
            Services ▾
            {pagesOpen && (
              <ul className="dropdown-menu">
                <li><Link to="/coin">Typing test</Link></li>
              </ul>
            )}
          </li>
          <li>Games</li>

          {/* ✅ PAGES DROPDOWN */}
          <li
            className="dropdown"
            onMouseEnter={() => setPagesOpen(true)}
            onMouseLeave={() => setPagesOpen(false)}
          >
            Simple task ▾
            {pagesOpen && (
              <ul className="dropdown-menu">
                <li><Link to="/coin">Coin</Link></li>
              </ul>
            )}
          </li>

          <li>Infos</li>
          {!user && <li><Link to="/register">Signup</Link></li>}
        </ul>

        {/* ACCOUNT AREA */}
        <div
          className="account-area"
          onMouseEnter={() => setAccountOpen(true)}
          onMouseLeave={() => setAccountOpen(false)}
        >
          {!user ? (
            <Link to="/login">
              <RiAccountCircleLine size={32} />
            </Link>
          ) : (
            <>
              <img
                src="https://i.pravatar.cc/40"
                alt="profile"
                className="profile-pic"
              />
{accountOpen && (
  <div className="account-dropdown">
    <span className="dropdown-arrow" />
    <ul>
      <li onClick={() => navigate("/account")}>ACCOUNT</li>
      <li onClick={handleLogout}>LOG OUT</li>
    </ul>
  </div>
)}

            </>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
