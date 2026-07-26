

import React, { useRef, useState } from "react";
import api from "../../../API/axios";
import "./ProfileSidebar.css";

const IMAGE_BASE_URL =
  import.meta.env.VITE_IMAGE_URL ||
  "https://project-coin.onrender.com";

const ProfilePic = ({ user, setUser }) => {
  const fileRef = useRef(null);

  const [uploading, setUploading] = useState(false);

  // ⭐ CORRECTION START
  // Used to force image refresh after upload
  const [refreshKey, setRefreshKey] = useState(Date.now());
  // ⭐ CORRECTION END

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

      // ⭐ CORRECTION START
      // Update sidebar immediately
      setUser((prev) => ({
        ...prev,
        profile_pic_url: res.data.profile_pic_url,
      }));

      // Force browser to reload image
      setRefreshKey(Date.now());
      // ⭐ CORRECTION END

    } catch (err) {
      console.error(err);
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
            ? `${IMAGE_BASE_URL}${user.profile_pic_url}?v=${refreshKey}`
            : ""
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
        hidden
        ref={fileRef}
        type="file"
        accept="image/*"
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