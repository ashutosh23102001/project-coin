
import React from "react";

const ProfileSidebar = ({ user }) => {
  return (
    <div className="profile-sidebar">
      <div className="profile-img-wrapper">
        <img
          src={user?.profile_pic_url || "https://i.pravatar.cc/150"}
          alt="profile"
        />
      </div>

      <h3>{user?.username || "Loading..."}</h3>
      <p>My Company</p>

      <div className="profile-stats">
        <div><strong>32</strong><span>Applied</span></div>
        <div><strong>26</strong><span>Won</span></div>
        <div><strong>6</strong><span>Active</span></div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
