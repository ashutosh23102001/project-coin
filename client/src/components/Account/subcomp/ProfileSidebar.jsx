
// import ProfilePic from "./ProfilePic"; // ✅ ADD
// import Referral from "./Earnings/Points"; // ✅ ADD
// const ProfileSidebar = ({ user, setUser }) => {
//   const fullName = [user?.first_name, user?.middle_name, user?.last_name]
//     .filter(Boolean)
//     .join(" ");

//   return (
//     <div className="profile-sidebar">

//       {/* ✅ REPLACED IMAGE BLOCK */}
//       <ProfilePic user={user} setUser={setUser} />

//       <h3>{user?.username}</h3>
//       <p>{fullName}</p>

//       <div className="profile-stats">
//         <div><strong>32</strong><span>Applied</span></div>
//         <div><strong>26</strong><span>Won</span></div>
//         <div><strong>6</strong><span>Active</span></div>
//       </div>
//       <div className="profile-bottom-card">
//         <button  >REFERRAL</button>
//       </div>
//     </div>
//   );
// };

// export default ProfileSidebar;


import ProfilePic from "./ProfilePic";

const ProfileSidebar = ({ user, setUser, setActiveTab }) => {
  const fullName = [user?.first_name, user?.middle_name, user?.last_name]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="profile-sidebar">

      <ProfilePic user={user} setUser={setUser} />

      <h3>{user?.username}</h3>
      <p>{fullName}</p>

      <div className="profile-stats">
        <div><strong>32</strong><span>Applied</span></div>
        <div><strong>26</strong><span>Won</span></div>
        <div><strong>6</strong><span>Active</span></div>
      </div>

      <div className="profile-bottom-card">
        {/* ✅ ONLY CHANGE */}
        <button
          className="refer"
          onClick={() => setActiveTab("REFERRAL_PAGE")}
        >
          REFERRAL
        </button>
      </div>

    </div>
  );
};

export default ProfileSidebar;
