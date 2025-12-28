// import React, { useRef, useState } from "react";
// import { RiPencilFill } from "react-icons/ri";


// const ProfileSidebar = () => {
//   const fileRef = useRef(null);
//   const [image, setImage] = useState("https://i.pravatar.cc/150");

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImage(URL.createObjectURL(file));
//       // later → upload to backend using FormData
//     }
//   };

//   return (
//     <div className="profile-sidebar">
//       <div className="profile-img-wrapper">
//         <img src={image} alt="Profile" />
//         <button className="edit" onClick={() => fileRef.current.click()}><RiPencilFill /></button>
//         <input
//           ref={fileRef}
//           type="file"
//           hidden
//           accept="image/*"
//           onChange={handleImageChange}
//         />
//       </div>

//       <h3>John Doe</h3>
//       <p>My Company</p>

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
