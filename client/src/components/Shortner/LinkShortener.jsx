

import React, { useState } from "react";
import api from "../../API/axios";
import "./shortener.css";

const LinkShortener = () => {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  const shorten = async () => {
    try {
      const res = await api.post("/shorten", { url, alias });
      setShortUrl(res.data.shortUrl);
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="shortener">
      <h2>URL Shortener</h2>

      <input
        placeholder="Paste long URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <input
        placeholder="Custom alias (optional)"
        value={alias}
        onChange={(e) => setAlias(e.target.value)}
      />

      <button onClick={shorten}>Shorten</button>

      {shortUrl && (
        <p>
          Short link:{" "}
          <a href={shortUrl} target="_blank">{shortUrl}</a>
        </p>
      )}
    </div>
  );
};

export default LinkShortener;
