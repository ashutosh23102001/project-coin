// import React, { useEffect, useState } from "react";
// import api from "../../API/axios";
// import "./Account.css";
// import Navbar from "../Navbar/Navbar";

// const Account = () => {
//   const [form, setForm] = useState({
//     username: "",
//     email: ""
//   });

//   const [msg, setMsg] = useState("");

//   useEffect(() => {
//     api.get("/account").then(res => {
//       setForm(res.data);
//     });
//   }, []);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await api.put("/account", form);
//       setMsg(res.data.message);
//     } catch (err) {
//       setMsg(err.response?.data?.message || "Error");
//     }
//   };

//   return (
//     <>
//     <Navbar />
//     <div className="account-page">
//       <h2>My Account</h2>

//       <form onSubmit={handleSubmit}>
//         <label>Username</label>
//         <input
//           name="username"
//           value={form.username}
//           onChange={handleChange}
//         />

//         <label>Email</label>
//         <input
//           name="email"
//           value={form.email}
//           onChange={handleChange}
//         />

//         <button type="submit">Update</button>
//         {msg && <p>{msg}</p>}
//       </form>
//     </div>
//     </>
//   );
// };

// export default Account; // 🔥 THIS WAS MISSING
import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import Cover from "./subcomp/Cover";
import ProfileSidebar from "./subcomp/ProfileSidebar";
import Tabs from "./subcomp/Tabs";
import AccountSettings from "./subcomp/AccountSettings";
import CompanySettings from "./subcomp/CompanySettings";

// ✅ ADS (same as coin.jsx)
import LeftAd from "../side-ad/Left_ad";
import RightAd from "../side-ad/Right_ad";

import "./Account.css";

const Account = () => {
  const [activeTab, setActiveTab] = useState("account");

  return (
    <>
      <Navbar />

      {/* PAGE BACKGROUND */}
      <div className="account-page-bg">

        {/* LEFT AD */}
        <LeftAd />

        {/* CENTER CONTENT */}
        <div className="account-wrapper">
  <div className="account-container">

    {/* COVER */}
    <Cover />

    {/* WHITE CARD */}
    <div className="account-card">
      <ProfileSidebar />

      <div className="account-content">
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "account" && <AccountSettings />}
        {activeTab === "company" && <CompanySettings />}
      </div>
    </div>

  </div>
</div>

        {/* RIGHT AD */}
        <RightAd />

      </div>
    </>
  );
};

export default Account;
