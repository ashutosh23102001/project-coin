
import React, { useEffect, useState } from "react";
import api from "../../../../API/axios";
import "../sub.css";
import Loader from "../../../Loader/Loader"; // ✅ ADDED


const EmailVerification = ({ email, setEmail }) => {
  const [editMode, setEditMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [emailFetched, setEmailFetched] = useState(false); // ✅ ADDED
  const [sendingOtp, setSendingOtp] = useState(false); // ✅ ADDED

  /* ================= FETCH EMAIL (ONCE ONLY) ================= */
  useEffect(() => {
    if (emailFetched) return; // ✅ PREVENT LOOP

    api
      .get("/get-email")
      .then(res => {
        setEmail(res.data.email || "");
        setEmailFetched(true); // ✅ MARK FETCHED
      })
      .catch(err => {
        console.error(
          "❌ Email fetch failed",
          err.response?.status,
          err.response?.data
        );
        setEmailFetched(true);
      });
  }, [emailFetched, setEmail]);

  /* ================= EDIT ================= */
  const onEdit = () => {
    setEditMode(true);
    setVerified(false);
    setOtpSent(false);
    setOtp("");
  };

const sendOtp = async () => {
    if (!email) {
      alert("Please enter email");
      return;
    }

    try {
      setSendingOtp(true);        // ✅ START LOADER
      await api.post("/send-email-otp", { email });
      setOtpSent(true);
    } catch (err) {
      alert("Failed to send OTP");
    } finally {
      setSendingOtp(false);       // ✅ STOP LOADER
    }
  };


  /* ================= VERIFY OTP ================= */
  const verifyOtp = async () => {
    await api.post("/verify-email-otp", { email, otp });

    setVerified(true);
    setEditMode(false);
    setOtpSent(false);
    setOtp("");
  };

  return (
    <section className="email">
      <label>Email</label>

      <div className="otp-row">
        <input
          value={email}
          onChange={e => setEmail(e.target.value)} // ✅ NOW WORKS
          disabled={!editMode || sendingOtp} // ✅ DISABLE WHILE LOADING
        />

        {!editMode && (
          <button type="button" onClick={onEdit}>
            Edit
          </button>
        )}

           {editMode && !otpSent && (
          <button
            type="button"
            className="otp-btn"
            onClick={sendOtp}
            disabled={sendingOtp} // ✅ DISABLE BUTTON
          >
            {sendingOtp ?  <Loader /> : "Send OTP"}
          </button>
        )}
      </div>

      {otpSent && (
        <div className="otp-row">
          <input
            placeholder="Enter OTP"
            value={otp}
            onChange={e => setOtp(e.target.value)}
          />
          <button type="button" onClick={verifyOtp}>
            Verify
          </button>
        </div>
      )}

      {verified && !editMode && (
        <p className="verified-text">✔ Email Verified</p>
      )}
    </section>
  );
};

export default EmailVerification;

