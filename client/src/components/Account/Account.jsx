

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

  useEffect(() => {
    api.get("/account").then(res => setUser(res.data));
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
              <ProfileSidebar user={user} setUser={setUser} />

              <div className="account-content">
                <Tabs
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />

                {activeTab === "account" && (
                  <AccountSettings
                    user={user}
                    setUser={setUser}
                  />
                )}

                {activeTab === "company" && <PersonalSettings />}
                {activeTab === "Contact" && <Contact />}
              </div>
            </div>
          </div>
        </div>

        {/* <RightAd /> */}
      </div>
    </>
  );
};

export default Account;
