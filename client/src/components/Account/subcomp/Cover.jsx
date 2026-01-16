

import React, { useRef, useState, useEffect } from "react";
import api from "../../../API/axios";
import ImageCropper from "../../../utils/ImageCropper";
import { processImage } from "../../../utils/imageProcess";
import "./sub.css";

const IMAGE_BASE = import.meta.env.VITE_IMAGE_URL;

const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1503264116251-35a269479413";

const Cover = ({ user, setUser }) => {
  const inputRef = useRef(null);
  const [cover, setCover] = useState(DEFAULT_COVER);
  const [rawImage, setRawImage] = useState(null);

  useEffect(() => {
    if (user && user.cover_pic_url) {
      setCover(`${IMAGE_BASE}${user.cover_pic_url}`);
    }
  }, [user]);
const handleSelect = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const previewUrl = URL.createObjectURL(file);

  setRawImage(previewUrl);
};

const handleCropDone = async (blob) => {
  setRawImage(null);

  const finalFile = await processImage(blob, 1600, 500);

  const formData = new FormData();
  formData.append("cover", finalFile);

  const res = await api.post("/upload-cover-pic", formData);

  setUser(prev => ({
    ...prev,
    cover_pic_url: res.data.cover_pic_url
  }));


    setCover(`${IMAGE_BASE}${res.data.cover_pic_url}`);
  };

  return (
    <>
      <div className="cover" style={{ backgroundImage: `url(${cover})` }}>
        <button className="cover-btn" onClick={() => inputRef.current.click()}>
          Change Cover
        </button>

        <input
          ref={inputRef}
          type="file"
          hidden
          accept="image/*"
          onChange={handleSelect}
        />
      </div>

      {rawImage && (
        <ImageCropper
          image={rawImage}
          aspect={16 / 5}
          onDone={handleCropDone}
          onCancel={() => setRawImage(null)}
        />
      )}
    </>
  );
};

export default Cover;
