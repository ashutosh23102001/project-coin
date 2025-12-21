import React, { useRef, useState } from "react";

const Cover = () => {
  const inputRef = useRef(null);
  const [cover, setCover] = useState(
    "https://images.unsplash.com/photo-1503264116251-35a269479413"
  );

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCover(URL.createObjectURL(file));
    }
  };

  return (
    <div>
        <div>
        <div className="cover" style={{ backgroundImage: `url(${cover})` }}>
        <button className="cover-btn" onClick={() => inputRef.current.click()}>
        Change Cover
        </button>
        </div>
        </div>
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
