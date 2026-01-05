

// import React, { useEffect, useState } from "react";
// import api from "../../API/axios";

// import Navbar from "../Navbar/Navbar";
// import Cover from "./subcomp/Cover";
// import ProfileSidebar from "./subcomp/ProfileSidebar";
// import Tabs from "./subcomp/Tabs";
// import AccountSettings from "./subcomp/AccountSettings";
// import PersonalSettings from "./subcomp/PersonalSettings";
// import Contact from "./subcomp/contact/Contact";
// import LeftAd from "../side-ad/Left_ad";
// import RightAd from "../side-ad/Right_ad";

// import "./Account.css";

// const Account = () => {
//   /* =========================
//      STATE
//   ========================= */
//   const [activeTab, setActiveTab] = useState("account");
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   /* =========================
//      FETCH PROFILE + ACCOUNT
//   ========================= */
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const [profileRes, accountRes] = await Promise.all([
//           api.get("/profile"), // name, username, pic
//           api.get("/account")  // email, phone, etc
//         ]);

//         /* ✅ MERGE BOTH RESPONSES */
//         setUser({
//           ...profileRes.data,
//           ...accountRes.data
//         });
//       } catch (err) {
//         console.error("❌ Failed to load user data", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, []);

//   /* =========================
//      LOADING STATE
//   ========================= */
//   if (loading) {
//     return <div style={{ padding: 40 }}>Loading account...</div>;
//   }

//   return (
//     <>
//       <Navbar />

//       <div className="account-page-bg">
//         {/* <LeftAd /> */}

//         <div className="account-wrapper">
//           <div className="account-container">
//             <Cover user={user} setUser={setUser} />

//             <div className="account-card">
//               <ProfileSidebar user={user} />

//               <div className="account-content">
//                 <Tabs
//                   activeTab={activeTab}
//                   setActiveTab={setActiveTab}
//                 />

//                 {activeTab === "account" && (
//                   <AccountSettings
//                     user={user}
//                     setUser={setUser}
//                   />
//                 )}

//                 {activeTab === "company" && (
//                   <PersonalSettings
//                     user={user}
//                     setUser={setUser}
//                   />
//                 )}

//                 {activeTab === "Contact" && (
//                   <Contact
//                     user={user}
//                     setUser={setUser}
//                   />
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* <RightAd /> */}
//       </div>
//     </>
//   );
// };

// export default Account;


import React, { useEffect, useState } from "react";
import api from "../../API/axios";

import Navbar from "../Navbar/Navbar";
import Cover from "./subcomp/Cover";
import ProfileSidebar from "./subcomp/ProfileSidebar";
import Tabs from "./subcomp/Tabs";
import AccountSettings from "./subcomp/AccountSettings";
import PersonalSettings from "./subcomp/PersonalSettings";
import Contact from "./subcomp/contact/Contact";
import LeftAd from "../side-ad/Left_ad";
import RightAd from "../side-ad/Right_ad";

import "./Account.css";

const Account = () => {
  const [activeTab, setActiveTab] = useState("account");
  const [user, setUser] = useState(null);

  // ✅ SINGLE, CORRECT FETCH
  useEffect(() => {
    api
      .get("/profile")
      .then(res => setUser(res.data))
      .catch(err => console.error("Profile fetch failed", err));
  }, []);

  return (
    <>
      <Navbar />

      <div className="account-page-bg">
        <LeftAd />

        <div className="account-wrapper">
          <div className="account-container">
            <Cover user={user} setUser={setUser} />

            <div className="account-card">
              {/* ✅ setUser PASSED CORRECTLY */}
              <ProfileSidebar user={user} setUser={setUser} />

              <div className="account-content">
                <Tabs
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />

                {activeTab === "account" && (
                  <AccountSettings user={user} setUser={setUser} />
                )}

                {activeTab === "company" && <PersonalSettings />}
                {activeTab === "Contact" && <Contact />}
              </div>
            </div>
          </div>
        </div>

        <RightAd />
      </div>
    </>
  );
};

export default Account;
