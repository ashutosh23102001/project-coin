import { useState, useEffect } from "react";
import api from "../../API/axios";

import Navbar from "../Navbar/Navbar";
import Left_ad from "../side-ad/Left_ad";
import Right_ad from "../side-ad/Right_ad";
import Bottom_ad from "../side-ad/Bottom_ad";

import { useAuth } from "../../context/AuthContext";

import "./Shortner.css";

const Shortner = () => {
  const { user, loading } = useAuth();

  const [url, setUrl] = useState("");

  const [shortUrl, setShortUrl] = useState("");

  const [history, setHistory] = useState([]);

  const [expanded, setExpanded] = useState(false);

  const [creating, setCreating] = useState(false);

  /* =========================
            LOAD HISTORY
    ========================= */

  useEffect(() => {
    if (!user) return;

    loadHistory();
  }, [user]);

  const loadHistory = async () => {
    try {
      const res = await api.get("/shortener/history", {
        withCredentials: true,
      });

      setHistory(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  /* =========================
          CREATE SHORT LINK
    ========================= */

  const createShortLink = async () => {
    if (!url.trim()) {
      alert("Enter URL");

      return;
    }

    try {
      setCreating(true);

      const res = await api.post(
        "/shortener/create",

        {
          original_url: url,
        },

        {
          withCredentials: true,
        },
      );

      setShortUrl(res.data.short_url);

      setUrl("");

      loadHistory();
    } catch (err) {
      console.log(err);

      alert("Unable to create link");
    } finally {
      setCreating(false);
    }
  };

  /* =========================
            COPY
    ========================= */

  const copyLink = (text) => {
    navigator.clipboard.writeText(text);

    alert("Copied Successfully");
  };

  const displayHistory = expanded ? history : history.slice(0, 3);

  if (loading) return <div style={{ color: "#fff" }}>Loading...</div>;

  if (!user) return null;
  return (
    <>
      <Navbar />

      <Left_ad />

      <Right_ad />

      <div className="coin-page">
        <div className="shortner-container">
          <div className="shortner-card">
            <h1 className="title">LINK SHORTENER</h1>

            <p className="subtitle">Create and manage your shortened links</p>

            {/* ================= INPUT ================= */}

            <div className="input-box">
              <input
                type="text"
                placeholder="Paste your long URL here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />

              <button onClick={createShortLink} disabled={creating}>
                {creating ? "Creating..." : "Shorten"}
              </button>
            </div>

            {/* ================= SHORT LINK ================= */}

            {shortUrl && (
              <>
                <div className="section-title">Shortened Link</div>

                <div className="output-box">
                  <input value={shortUrl} readOnly />

                  <button onClick={() => copyLink(shortUrl)}>Copy</button>
                </div>
              </>
            )}
          </div>

          {/* ================= HISTORY ================= */}

          {/* ================= HISTORY ================= */}

          <div className="history-card">
            <h2>Recent History</h2>

            {/* Scrollable Table */}

            <div className="history-table-wrapper">
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
                      <td
                        colSpan="4"
                        style={{
                          textAlign: "center",
                          padding: "30px",
                        }}
                      >
                        No Short Links Found
                      </td>
                    </tr>
                  ) : (
                    displayHistory.map((item, index) => (
                      <tr key={item.id}>
                        <td>{index + 1}</td>

                        <td>
                          <a
                            href={item.short_url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {item.short_url}
                          </a>
                        </td>

                        <td>{item.clicks}</td>

                        <td>
                          <button
                            className="copy-small"
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
            </div>

            {/* Expand Button */}

            {history.length > 3 && (
              <div className="expand-wrapper">
                <button
                  className="expand-btn"
                  onClick={() => setExpanded(!expanded)}
                >
                  {expanded ? "▲ Show Less" : "▼ Expand History"}
                </button>
              </div>
            )}
          </div>

          {/* Bottom Ad */}

          
        </div>
      </div>

      <Bottom_ad />
    </>
  );
};

export default Shortner;
