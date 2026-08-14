import React, { useEffect, useState } from "react";
import "./Shortner.css";
import api from "../../API/axios";
const Shortner = () => {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [history, setHistory] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await api.get("/shortener/history");
      setHistory(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const shortenLink = async () => {
    if (!url.trim()) {
      alert("Enter a URL");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/shortener/create", {
        original_url: url,
      });

      setShortUrl(res.data.short_url);
      setUrl("");

      loadHistory();
    } catch (err) {
      console.log(err);
      alert("Unable to create short link.");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied");
  };

  const displayHistory = expanded ? history : history.slice(0, 3);

  return (
    <div className="shortner-page">
      <div className="shortner-card">
        <h1>LINK SHORTENER</h1>

        <p>Create and manage your shortened links.</p>

        {/* INPUT */}

        <div className="input-row">
          <input
            type="text"
            placeholder="Paste your long URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <button onClick={shortenLink} disabled={loading}>
            {loading ? "Creating..." : "Shorten"}
          </button>
        </div>

        {/* OUTPUT */}

        {shortUrl && (
          <>
            <h3>Shortened Link</h3>

            <div className="output-row">
              <input value={shortUrl} readOnly />

              <button onClick={() => copyLink(shortUrl)}>Copy</button>
            </div>
          </>
        )}
      </div>

      {/* HISTORY */}

      <div className="history-card">
        <h2>Recent History</h2>

        <table>
          <thead>
            <tr>
              <th>No.</th>

              <th>Short Link</th>

              <th>Clicks</th>

              <th>Copy</th>
            </tr>
          </thead>

          <tbody>
            {displayHistory.length === 0 ? (
              <tr>
                <td colSpan="4">No links created.</td>
              </tr>
            ) : (
              displayHistory.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>

                  <td>
                    <a href={item.short_url} target="_blank" rel="noreferrer">
                      {item.short_url}
                    </a>
                  </td>

                  <td>{item.clicks}</td>

                  <td>
                    <button
                      className="copy-btn"
                      onClick={() => copyLink(item.short_url)}
                    >
                      Copy
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {history.length > 3 && (
          <button className="expand-btn" onClick={() => setExpanded(!expanded)}>
            {expanded ? "▲ Show Less" : "▼ Expand History"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Shortner;
