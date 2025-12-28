
import React, { useRef, useState, useEffect } from "react";
import api from "../../../API/axios";

const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1503264116251-35a269479413";

const IMAGE_BASE = import.meta.env.VITE_IMAGE_URL;

const Cover = ({ user, setUser }) => {
  const inputRef = useRef(null);
  const [cover, setCover] = useState(DEFAULT_COVER);

  // 🔁 Load cover from DB on refresh
  useEffect(() => {
    if (user?.cover_pic_url) {
      setCover(`${IMAGE_BASE}${user.cover_pic_url}`);
    }
  }, [user]);

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setCover(preview);

    const formData = new FormData();
    formData.append("cover", file);
    formData.append("user_id", user.user_id);
    formData.append("username", user.username);

    try {
      const res = await api.put("/cover", formData);

      setUser(prev => ({
        ...prev,
        cover_pic_url: res.data.cover_pic_url
      }));

      // ✅ use IMAGE base URL
      setCover(`${IMAGE_BASE}${res.data.cover_pic_url}`);
    } catch (err) {
      alert("Cover upload failed");
    } finally {
      URL.revokeObjectURL(preview);
    }
  };

  return (
    <div className="cover" style={{ backgroundImage: `url(${cover})` }}>
      <button
        className="cover-btn"
        onClick={() => inputRef.current.click()}
      >
        Change Cover
      </button>

      <input
        type="file"
        hidden
        ref={inputRef}
        accept="image/*"
        onChange={handleChange}
      />
    </div>
  );
};

export default Cover;
