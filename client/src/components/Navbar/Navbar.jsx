// import React, { useEffect, useRef, useState } from "react";
// import logo from "../assets/coin.png";
// import "./Navbar.css";
// import { Link, useNavigate } from "react-router-dom";
// import { RiAccountCircleLine } from "react-icons/ri";
// import { useAuth } from "../../context/AuthContext";
// import api from "../../API/axios";
// import defaultProfile from "../../../assets/default_pic.webp";

// const Navbar = () => {

//   const navigate = useNavigate();

//   const [servicesOpen, setServicesOpen] = useState(false);
//   const [tasksOpen, setTasksOpen] = useState(false);
//   const [accountOpen, setAccountOpen] = useState(false);

//   const [profilePic, setProfilePic] = useState(null);

//   const servicesTimer = useRef(null);
//   const tasksTimer = useRef(null);
//   const accountTimer = useRef(null);

//   const { user, logout } = useAuth();

//   /* ============================================
//      ⭐ CORRECTION
//      Fallback image URL
//   ============================================ */

//   const IMAGE_BASE_URL =
//     import.meta.env.VITE_IMAGE_URL ||
//     "https://project-coin.onrender.com";

//   /* ============================================
//      FETCH PROFILE PIC
//   ============================================ */

//   useEffect(() => {

//     if (!user) {
//       setProfilePic(null);
//       return;
//     }

//     const fetchProfile = async () => {

//       try {

//         const res = await api.get("/profile");

//         console.log("PROFILE API:", res.data);

//         if (res.data?.profile_pic_url) {

//           setProfilePic(
//             IMAGE_BASE_URL + res.data.profile_pic_url
//           );

//         } else {

//           setProfilePic(null);

//         }

//       } catch (err) {

//         console.error(err);

//         setProfilePic(null);

//       }

//     };

//     fetchProfile();

//   }, [user]);

//   /* ============================================
//      TIMER HELPERS
//   ============================================ */

//   const startCloseTimer = (setter, ref) => {
//     ref.current = setTimeout(() => setter(false), 500);
//   };

//   const cancelCloseTimer = (ref) => {
//     if (ref.current) clearTimeout(ref.current);
//   };

//   const logoutAndRedirect = async (path) => {

//     try {

//       await api.post("/logout");

//     } catch (err) {

//       console.warn(err);

//     } finally {

//       logout();

//       navigate(path);

//     }

//   };

//   return (

//     <nav className="navbar">

//       <div className="nav-container">

//         {/* LOGO */}

//         <div className="logo">

//           <img
//             src={logo}
//             alt="logo"
//             className="logo-icon"
//           />

//         </div>

//         <ul className="nav-links">

//           <li>
//             <Link to="/">Home</Link>
//           </li>

//           <li
//             className="dropdown"
//             onMouseEnter={() => {

//               cancelCloseTimer(servicesTimer);

//               setServicesOpen(true);

//             }}
//             onMouseLeave={() =>
//               startCloseTimer(
//                 setServicesOpen,
//                 servicesTimer
//               )
//             }
//           >

//             Services ▾

//             {servicesOpen && (

//               <div className="account-dropdown menu-dropdown">

//                 <span className="dropdown-arrow left" />

//                 <ul>

//                   <li>

//                     <Link to="/shortner">
//                       Link shortner
//                     </Link>

//                   </li>

//                 </ul>

//               </div>

//             )}

//           </li>

//           <li
//             className="dropdown"
//             onMouseEnter={() => {

//               cancelCloseTimer(servicesTimer);

//               setServicesOpen(true);

//             }}
//             onMouseLeave={() =>
//               startCloseTimer(
//                 setServicesOpen,
//                 servicesTimer
//               )
//             }
//           >

//             Games ▾

//             {servicesOpen && (

//               <div className="account-dropdown menu-dropdown">

//                 <span className="dropdown-arrow left" />

//                 <ul>

//                   <li>

//                     <Link to="/spin">
//                       Spin Game
//                     </Link>

//                   </li>

//                 </ul>

//               </div>

//             )}

//           </li>

//           <li
//             className="dropdown"
//             onMouseEnter={() => {

//               cancelCloseTimer(tasksTimer);

//               setTasksOpen(true);

//             }}
//             onMouseLeave={() =>
//               startCloseTimer(
//                 setTasksOpen,
//                 tasksTimer
//               )
//             }
//           >

//             Simple task ▾

//             {tasksOpen && (

//               <div className="account-dropdown menu-dropdown">

//                 <span className="dropdown-arrow left" />

//                 <ul>

//                   <li>

//                     <Link to="/coin">
//                       Coin
//                     </Link>

//                   </li>

//                 </ul>

//               </div>

//             )}

//           </li>

//           <li
//             className="clickable"
//             onClick={() =>
//               logoutAndRedirect("/register")
//             }
//           >
//             Signup
//           </li>

//         </ul>

//         {/* ACCOUNT */}

//         <div
//           className="account-area"
//           onMouseEnter={() => {

//             cancelCloseTimer(accountTimer);

//             setAccountOpen(true);

//           }}
//           onMouseLeave={() =>
//             startCloseTimer(
//               setAccountOpen,
//               accountTimer
//             )
//           }
//         >

//           {!user ? (

//             <Link to="/login">

//               <RiAccountCircleLine size={32} />

//             </Link>

//           ) : (

//             <>

//               {/* ⭐ CORRECTION */}

//               <img
//                 src={
//                   profilePic
//                     ? profilePic
//                     : defaultProfile
//                 }
//                 alt="profile"
//                 className="profile-pic"
//                 onError={(e) => {

//                   e.target.src =
//                     defaultProfile;

//                 }}
//               />

//               {accountOpen && (

//                 <div className="account-dropdown">

//                   <span className="dropdown-arrow" />

//                   <ul>

//                     <li
//                       onClick={() =>
//                         navigate("/account")
//                       }
//                     >
//                       Account
//                     </li>

//                     <li
//                       onClick={() =>
//                         logoutAndRedirect("/login")
//                       }
//                     >
//                       Log out
//                     </li>

//                   </ul>

//                 </div>

//               )}

//             </>

//           )}

//         </div>

//       </div>

//     </nav>

//   );

// };

// export default Navbar;

import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiAccountCircleLine } from "react-icons/ri";

import logo from "../assets/coin.png";
import "./Navbar.css";

import api from "../../API/axios";
import { useAuth } from "../../context/AuthContext";

import defaultProfile from "../../../assets/default_pic.webp";

const Navbar = () => {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  /* ============================
            STATES
    ============================ */

  const [openMenu, setOpenMenu] = useState(null);

  const [profilePic, setProfilePic] = useState(null);

  const timer = useRef(null);

  const IMAGE_BASE_URL =
    import.meta.env.VITE_IMAGE_URL || "https://project-coin.onrender.com";

  /* ============================
        COMMON DROPDOWN
    ============================ */

  const openDropdown = (menu) => {
    clearTimeout(timer.current);

    setOpenMenu(menu);
  };

  const closeDropdown = () => {
    timer.current = setTimeout(() => {
      setOpenMenu(null);
    }, 250);
  };

  /* ============================
        FETCH PROFILE
    ============================ */

  useEffect(() => {
    if (!user) {
      setProfilePic(null);

      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile");

        if (res.data?.profile_pic_url) {
          setProfilePic(IMAGE_BASE_URL + res.data.profile_pic_url);
        } else {
          setProfilePic(null);
        }
      } catch (err) {
        console.error(err);

        setProfilePic(null);
      }
    };

    fetchProfile();
  }, [user]);

  /* ============================
            LOGOUT
    ============================ */

  const logoutAndRedirect = async (path) => {
    try {
      await api.post("/logout");
    } catch (err) {
      console.log(err);
    } finally {
      logout();

      navigate(path);
    }
  };
  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* ================= LOGO ================= */}

        <div className="logo">
          <Link to="/">
            <img src={logo} alt="Logo" className="logo-icon" />
          </Link>
        </div>

        {/* ================= MENU ================= */}

        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>

          {/* ================= SERVICES ================= */}

          <li
            className="dropdown"
            onMouseEnter={() => openDropdown("services")}
            onMouseLeave={closeDropdown}
          >
            Services
            {openMenu === "services" && (
              <div className="account-dropdown menu-dropdown">
                <span className="dropdown-arrow left" />

                <ul>
                  <li>
                    <Link to="/shortner">Link Shortner</Link>
                  </li>
                </ul>
              </div>
            )}
          </li>

          {/* ================= GAMES ================= */}

          <li
            className="dropdown"
            onMouseEnter={() => openDropdown("games")}
            onMouseLeave={closeDropdown}
          >
            Games
            {openMenu === "games" && (
              <div className="account-dropdown menu-dropdown">
                <span className="dropdown-arrow left" />

                <ul>
                  <li>
                    <Link to="/spin">Spin Game</Link>
                  </li>
                </ul>
              </div>
            )}
          </li>

          {/* ================= SIMPLE TASK ================= */}

          <li
            className="dropdown"
            onMouseEnter={() => openDropdown("tasks")}
            onMouseLeave={closeDropdown}
          >
            Simple Task
            {openMenu === "tasks" && (
              <div className="account-dropdown menu-dropdown">
                <span className="dropdown-arrow left" />

                <ul>
                  <li>
                    <Link to="/coin">Coin Game</Link>
                  </li>
                </ul>
              </div>
            )}
          </li>

          {/* ================= SIGNUP ================= */}

          <li
            className="clickable"
            onClick={() => logoutAndRedirect("/register")}
          >
            Signup
          </li>
        </ul>
        {/* ================= ACCOUNT ================= */}

        <div
          className="account-area"
          onMouseEnter={() => openDropdown("account")}
          onMouseLeave={closeDropdown}
        >
          {!user ? (
            <Link to="/login">
              <RiAccountCircleLine size={34} color="#fff" />
            </Link>
          ) : (
            <>
              <img
                src={profilePic ? profilePic : defaultProfile}
                alt="Profile"
                className="profile-pic"
                onError={(e) => {
                  e.target.src = defaultProfile;
                }}
              />

              {openMenu === "account" && (
                <div className="account-dropdown">
                  <span className="dropdown-arrow" />

                  <ul>
                    <li
                      onClick={() => {
                        navigate("/account");

                        setOpenMenu(null);
                      }}
                    >
                      Account
                    </li>

                    <li
                      onClick={() => {
                        logoutAndRedirect("/login");

                        setOpenMenu(null);
                      }}
                    >
                      Log Out
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
