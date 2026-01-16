


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
import Points from "./subcomp/Earnings/Points";

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
                {activeTab === "Earn" && <Points />}

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
