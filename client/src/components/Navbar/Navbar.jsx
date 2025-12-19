// import React, {useState} from "react";
// import "./Navbar.css";
// import logo from "../assets/coin.png";   // ← correct import
// import { Link, useNavigate } from "react-router-dom";
// import { RiAccountCircleLine } from "react-icons/ri";
// import { useAuth } from "../../context/AuthContext";
// import api from "../../API/axios";



// const Navbar = () => {
//   const [isDropdownOpen, setDropdownOpen] = useState(false);
//   const navigate = useNavigate();

//   return (
//     <nav className="navbar">
//       <div className="nav-container">
//         <div className="logo">
//           <img src={logo} alt="logo" className="logo-icon" />
//         </div>

//         <ul className="nav-links">
//                 <li><Link to= "/">Home</Link></li>
//           <li>Services</li>
//           <li>Projects</li>
//            <li
//             className="dropdown"
//             onMouseEnter={() => setDropdownOpen(true)}
//             onMouseLeave={() => setDropdownOpen(false)}
//           >
//             Pages ▾
//             {isDropdownOpen && (
//               <ul className="dropdown-menu">
//                 <li><Link to= "/coin">Coin</Link></li>
//               </ul>
//             )}
//           </li>
//           <li>Infos</li>
//           <li><Link to= "/register">signup</Link></li>
//         </ul>
//         <a href="/login"><div className="logo">
//                 <span className="material-symbols-outlined">
//             <RiAccountCircleLine />
//           </span>
//         </div></a>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


// part 2

// import React, { useState } from "react";
// import "./Navbar.css";
// import logo from "../assets/coin.png";
// import { Link, useNavigate } from "react-router-dom";
// import { RiAccountCircleLine } from "react-icons/ri";
// import { useAuth } from "../../context/AuthContext";
// import api from "../../API/axios";

// const Navbar = () => {
//   const [isDropdownOpen, setDropdownOpen] = useState(false);
//   const navigate = useNavigate();

//   const { user, logout } = useAuth(); // 🔥 AUTH STATE

//   const handleLogout = async () => {
//     await api.post("/logout");
//     logout();
//     navigate("/login");
//   };

//   return (
//     <nav className="navbar">
//       <div className="nav-container">
        
//         {/* LOGO */}
//         <div className="logo">
//           <img src={logo} alt="logo" className="logo-icon" />
//         </div>

//         {/* NAV LINKS */}
//         <ul className="nav-links">
//           <li><Link to="/">Home</Link></li>
//           <li>Services</li>
//           <li>Projects</li>

//           <li
//             className="dropdown"
//             onMouseEnter={() => setDropdownOpen(true)}
//             onMouseLeave={() => setDropdownOpen(false)}
//           >
//             Pages ▾
//             {isDropdownOpen && (
//               <ul className="dropdown-menu">
//                 <li><Link to="/coin">Coin</Link></li>
//               </ul>
//             )}
//           </li>

//           <li>Infos</li>

//           {!user && <li><Link to="/register">Signup</Link></li>}
//         </ul>

//         {/* RIGHT SIDE AUTH ICON */}
//         <div
//           className="account-area"
//           onMouseEnter={() => setDropdownOpen(true)}
//           onMouseLeave={() => setDropdownOpen(false)}
//         >
//           {!user ? (
//             // 🔐 NOT LOGGED IN
//             <Link to="/login">
//               <RiAccountCircleLine size={32} />
//             </Link>
//           ) : (
//             // ✅ LOGGED IN
//             <>
//               <img
//                 src="https://i.pravatar.cc/40"
//                 alt="profile"
//                 className="profile-pic"
//               />

//               {isDropdownOpen && (
//                 <ul className="account-dropdown">
//                   <li onClick={() => navigate("/account")}>My Account</li>
//                   <li onClick={handleLogout}>Logout</li>
//                 </ul>
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

// part 3
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
          <li>Services</li>
          <li>Projects</li>

          {/* ✅ PAGES DROPDOWN */}
          <li
            className="dropdown"
            onMouseEnter={() => setPagesOpen(true)}
            onMouseLeave={() => setPagesOpen(false)}
          >
            Pages ▾
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
