

// import React, { useRef, useState } from "react";
// import api from "../../../API/axios";
// import "./ProfileSidebar.css";

// const ProfilePic = ({ user, setUser }) => {
//   const fileRef = useRef(null);
//   const [uploading, setUploading] = useState(false);

//   const openFile = () => fileRef.current.click();

//   const onFileChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("profile", file);

//     try {
//       setUploading(true);

//       const res = await api.post(
//         "/upload-profile-pic",
//         formData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );

//       // ✅ UPDATE STATE IMMEDIATELY
//       setUser(prev => ({
//         ...prev,
//         profile_pic_url: res.data.profile_pic_url
//       }));
//     } catch (err) {
//       console.error(err);
//       alert("Upload failed");
//     } finally {
//       setUploading(false);
//     }
//   };


// const IMAGE_BASE_URL =
//   import.meta.env.VITE_IMAGE_URL ||
//   "https://project-coin.onrender.com";

//   return (
//     <div className="profile-pic-wrapper">
//       <img
//         src={
//           user?.profile_pic_url
//             ? `${import.meta.env.VITE_IMAGE_URL}${user.profile_pic_url}`
//             : "https://i.pravatar.cc/150"
//         }
//         alt="profile"
//       />

//       <button className="edit-pic-btn" onClick={openFile}>
//         ✏️
//       </button>

//       <input
//         type="file"
//         accept="image/*"
//         ref={fileRef}
//         hidden
//         onChange={onFileChange}
//       />

//       {uploading && <div className="upload-overlay">Uploading...</div>}
//     </div>
//   );
// };

// export default ProfilePic;

// all fix//

import React, { useRef, useState } from "react";
import api from "../../../API/axios";
import "./ProfileSidebar.css";

const ProfilePic = ({ user, setUser }) => {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  /* =========================
     CORRECTION START
     Use fallback if env variable is missing
  ========================= */

  const IMAGE_BASE_URL =
    import.meta.env.VITE_IMAGE_URL ||
    "https://project-coin.onrender.com";

  /* =========================
     CORRECTION END
  ========================= */

  const openFile = () => {
    fileRef.current.click();
  };

  const onFileChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("profile", file);

    try {
      setUploading(true);

      const res = await api.post(
        "/upload-profile-pic",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      /* =========================
         CORRECTION START
      ========================= */

      setUser((prev) => ({
        ...prev,
        profile_pic_url: res.data.profile_pic_url,
      }));

      /* =========================
         CORRECTION END
      ========================= */

    } catch (err) {
      console.error(err);

      if (err.response) {
        console.log(err.response.data);
      }

      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="profile-pic-wrapper">

      <img
        src={
          user?.profile_pic_url
            ? `${IMAGE_BASE_URL}${user.profile_pic_url}` // ⭐ CORRECTED
            : "https://i.pravatar.cc/150"
        }
        alt="profile"
      />

      <button
        className="edit-pic-btn"
        onClick={openFile}
      >
        ✏️
      </button>

      <input
        type="file"
        accept="image/*"
        hidden
        ref={fileRef}
        onChange={onFileChange}
      />

      {uploading && (
        <div className="upload-overlay">
          Uploading...
        </div>
      )}

    </div>
  );
};

export default ProfilePic;