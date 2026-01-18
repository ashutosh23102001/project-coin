
import { useEffect, useState } from "react";
import api from "../../../../API/axios";
import { IoMdCopy } from "react-icons/io";
import "./Referral.css";

const Referral = () => {
  const [code, setCode] = useState("");
  const [users, setUsers] = useState([]);
  const [count, setCount] = useState(0);
  const [copied, setCopied] = useState(false); // ✅ ADD

  useEffect(() => {
    api.get("/referral").then(res => setCode(res.data.referralCode || ""));
    api.get("/referral/stats").then(res => setCount(res.data.totalReferrals || 0));
    api.get("/referral/users").then(res => setUsers(res.data.users || []));
  }, []);

  const referralLink = `${window.location.origin}/register?ref=${code}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);                    // ✅ trigger animation
    setTimeout(() => setCopied(false), 300); // ✅ reset
  };

  return (
    <div className="referral-wrapper">
      <h2 className="referral-title">Referral Program</h2>

      <div className="ref-box">
        <span className="label">Your Referral Code</span>
        <strong className="code">{code}</strong>
      </div>

      <div className="ref-link-row">
        <input value={referralLink} readOnly />

        {/* ✅ ANIMATED COPY BUTTON */}
        <button
          className={`copy-btn ${copied ? "copied" : ""}`}
          onClick={handleCopy}
          title="Copy link"
        >
          <IoMdCopy size={18} />
        </button>
      </div>

      <div className="total-box">
        Total Referrals: <strong>{count}</strong>
      </div>

      <table className="ref-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="2" style={{ textAlign: "center" }}>
                No referrals yet
              </td>
            </tr>
          ) : (
            users.map((u, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{u}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Referral;
