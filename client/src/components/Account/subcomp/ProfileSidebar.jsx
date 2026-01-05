

// import React from "react";

// const ProfileSidebar = ({ user }) => {
//   const fullName = [
//     user?.first_name,
//     user?.middle_name,
//     user?.last_name
//   ]
//     .filter(Boolean) // removes null / empty
//     .join(" ");

//   return (
//     <div className="profile-sidebar">
//       <div className="profile-img-wrapper">
//         <img
//           src={user?.profile_pic_url || "https://i.pravatar.cc/150"}
//           alt="profile"
//         />
//       </div>

//       <h3>{user?.username || "Loading..."}</h3>

//       {/* ✅ FULL NAME FROM DB */}
//       <p>{fullName || "—"}</p>

//       <div className="profile-stats">
//         <div>
//           <strong>32</strong>
//           <span>Applied</span>
//         </div>
//         <div>
//           <strong>26</strong>
//           <span>Won</span>
//         </div>
//         <div>
//           <strong>6</strong>
//           <span>Active</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfileSidebar;



// part 2



// import React from "react";
// import { FaPencilAlt } from "react-icons/fa"; // ✅ ADDED ICON
// import "./ProfileSidebar.css"; // ✅ ENSURE CSS FILE IMPORT


// const ProfileSidebar = ({ user, onEditProfilePic }) => {
//   const fullName = [
//     user?.first_name,
//     user?.middle_name,
//     user?.last_name
//   ]
//     .filter(Boolean)
//     .join(" ");

//   return (
//     <div className="profile-sidebar">
//       {/* ================= PROFILE IMAGE ================= */}
//       <div className="profile-img-wrapper">
//         <img
//           src={user?.profile_pic_url || "https://i.pravatar.cc/150"}
//           alt="profile"
//         />

//         {/* ✅ PENCIL BUTTON OVER IMAGE */}
//         <button
//           className="profile-edit-btn"
//           type="button"
//           onClick={onEditProfilePic}
//           title="Edit profile picture"
//         >
//           <FaPencilAlt />
//         </button>
//       </div>

//       {/* ================= USER INFO ================= */}
//       <h3>{user?.username || "Loading..."}</h3>
//       <p>{fullName || "—"}</p>

//       {/* ================= STATS ================= */}
//       <div className="profile-stats">
//         <div>
//           <strong>32</strong>
//           <span>Applied</span>
//         </div>
//         <div>
//           <strong>26</strong>
//           <span>Won</span>
//         </div>
//         <div>
//           <strong>6</strong>
//           <span>Active</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfileSidebar;


// part 3
import React from "react";

import ProfilePic from "./ProfilePic"; // ✅ ADD

const ProfileSidebar = ({ user, setUser }) => {
  const fullName = [user?.first_name, user?.middle_name, user?.last_name]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="profile-sidebar">

      {/* ✅ REPLACED IMAGE BLOCK */}
      <ProfilePic user={user} setUser={setUser} />

      <h3>{user?.username}</h3>
      <p>{fullName}</p>

      <div className="profile-stats">
        <div><strong>32</strong><span>Applied</span></div>
        <div><strong>26</strong><span>Won</span></div>
        <div><strong>6</strong><span>Active</span></div>
      </div>
    </div>
  );
};

export default ProfileSidebar;

