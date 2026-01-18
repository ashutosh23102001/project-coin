
import React, { useEffect, useRef, useState } from "react";
import "./Navbar.css";
import logo from "../assets/coin.png";
import { Link, useNavigate } from "react-router-dom";
import { RiAccountCircleLine } from "react-icons/ri";
import { useAuth } from "../../context/AuthContext";
import api from "../../API/axios";

/* =====================================================
   🧭 NAVBAR
===================================================== */
const Navbar = () => {
  const navigate = useNavigate();

  /* ================= STATES ================= */
  const [servicesOpen, setServicesOpen] = useState(false);
  const [tasksOpen, setTasksOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const [profilePic, setProfilePic] = useState(null);

  const servicesTimer = useRef(null);
  const tasksTimer = useRef(null);
  const accountTimer = useRef(null);

  const { user, logout } = useAuth();

  /* ================= FETCH PROFILE PIC ================= */
  useEffect(() => {
    if (!user) return;

    api.get("/profile")
      .then(res => {
        if (res.data?.profile_pic_url) {
          setProfilePic(
            `${import.meta.env.VITE_IMAGE_URL}${res.data.profile_pic_url}`
          );
        }
      })
      .catch(() => {
        setProfilePic(null); 
      });
  }, [user]);

  /* ================= TIMER HELPERS ================= */
  const startCloseTimer = (setter, ref) => {
    ref.current = setTimeout(() => setter(false), 500);
  };

  const cancelCloseTimer = ref => {
    if (ref.current) clearTimeout(ref.current);
  };

  const logoutAndRedirect = async (path) => {
    try {
      await api.post("/logout");
    } catch (err) {
      console.warn("Logout API failed");
    } finally {
      logout();         
      navigate(path);    
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">

        {/* LOGO */}
        <div className="logo">
          <img src={logo} alt="logo" className="logo-icon" />
        </div>

        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>

          {/* SERVICES */}
          <li
            className="dropdown"
            onMouseEnter={() => {
              cancelCloseTimer(servicesTimer);
              setServicesOpen(true);
            }}
            onMouseLeave={() =>
              startCloseTimer(setServicesOpen, servicesTimer)
            }
          >
            Services ▾
            {servicesOpen && (
              <div className="account-dropdown menu-dropdown">
                <span className="dropdown-arrow left" />
                <ul>
                  <li><Link to="/">Link shortner</Link></li>
                </ul>
              </div>
            )}
          </li>

          <li>Games</li>

          <li
            className="dropdown"
            onMouseEnter={() => {
              cancelCloseTimer(tasksTimer);
              setTasksOpen(true);
            }}
            onMouseLeave={() =>
              startCloseTimer(setTasksOpen, tasksTimer)
            }
          >
            Simple task ▾
            {tasksOpen && (
              <div className="account-dropdown menu-dropdown">
                <span className="dropdown-arrow left" />
                <ul>
                  <li><Link to="/coin">Coin</Link></li>
                </ul>
              </div>
            )}
          </li>

          <li
            className="clickable"
            onClick={() => logoutAndRedirect("/register")}
          >
            Signup
          </li>
        </ul>

        {/* ================= ACCOUNT AREA ================= */}
        <div
          className="account-area"
          onMouseEnter={() => {
            cancelCloseTimer(accountTimer);
            setAccountOpen(true);
          }}
          onMouseLeave={() =>
            startCloseTimer(setAccountOpen, accountTimer)
          }
        >
          {!user ? (
            <Link to="/login">
              <RiAccountCircleLine size={32} />
            </Link>
          ) : (
            <>
              <img
                src={profilePic || "https://i.pravatar.cc/40"}
                alt="profile"
                className="profile-pic"
              />

              {accountOpen && (
                <div className="account-dropdown">
                  <span className="dropdown-arrow" />
                  <ul>
                    <li onClick={() => navigate("/account")}>
                      Account
                    </li>

                    <li
                      onClick={() => logoutAndRedirect("/login")}
                    >
                      Log out
                    </li>
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
