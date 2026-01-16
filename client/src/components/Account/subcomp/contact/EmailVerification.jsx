
import React, { useEffect, useState } from "react";
import api from "../../../../API/axios";
import "../sub.css";
import Loader from "../../../Loader/Loader";
import Timer from "../../../Timer/Timer";

/* =====================================================
   📧 EMAIL VERIFICATION COMPONENT
===================================================== */
const EmailVerification = ({ email, setEmail }) => {
  /* ================= STATE ================= */
  const [editMode, setEditMode] = useState(false);      // 🔧 default false
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [emailFetched, setEmailFetched] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [resendingOtp, setResendingOtp] = useState(false); // 🔧 NEW
  const [timeLeft, setTimeLeft] = useState(0);

  /* ================= FETCH EMAIL (LOCKED INITIALLY) ================= */
  useEffect(() => {
    if (emailFetched) return;

    api
      .get("/get-email")
      .then(res => {
        setEmail(res.data.email || "");
        setEmailFetched(true);
        setEditMode(false); // 🔧 email locked initially
      })
      .catch(() => setEmailFetched(true));
  }, [emailFetched, setEmail]);

  /* ================= OTP TIMER ================= */
  useEffect(() => {
    if (!otpSent || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [otpSent, timeLeft]);

  /* ================= EDIT ================= */
  const onEdit = () => {
    setEditMode(true);
    setOtpSent(false);
    setVerified(false);
    setOtp("");
    setTimeLeft(0);
  };

  /* ================= SEND OTP ================= */
  const sendOtp = async () => {
    if (!email) return alert("Enter email");

    try {
      setSendingOtp(true);
      await api.post("/send-email-otp", { email });

      setOtpSent(true);
      setEditMode(false);        // 🔒 lock email
      setTimeLeft(60);
    } catch {
      alert("Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  /* ================= RESEND OTP ================= */
  const resendOtp = async () => {
    try {
      setResendingOtp(true);
      await api.post("/send-email-otp", { email });
      setTimeLeft(60);
      setOtp("");
    } catch {
      alert("Failed to resend OTP");
    } finally {
      setResendingOtp(false);
    }
  };

  /* ================= VERIFY OTP ================= */
  const verifyOtp = async () => {
    try {
      await api.post("/verify-email-otp", { email, otp });
      setVerified(true);
      setOtpSent(false);
      setOtp("");
    } catch (err) {
      alert(err.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <section className="email-section">
      <label>Email</label>

      {/* ================= EMAIL ROW ================= */}
      <div className="otp-row">
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={!editMode}        // 🔧 locked by default
        />

        {!editMode && (
          <button className="otp-btn" onClick={onEdit}>
            Edit
          </button>
        )}

        {editMode && !otpSent && (
          <button className="otp-btn" onClick={sendOtp} disabled={sendingOtp}>
            {sendingOtp ? <Loader /> : "Send OTP"}
          </button>
        )}
      </div>

      {/* ================= OTP ROW (SAME HEIGHT, SAME LINE) ================= */}
      {otpSent && (
        <div className="otp-row fixed-height-row">
          <input
            placeholder="Enter OTP"
            value={otp}
            onChange={e => setOtp(e.target.value)}
          />

          <button className="verify-btn" onClick={verifyOtp}>
            Verify
          </button>

          {/* 🔧 Timer / Resend / Loader — fixed width */}
          <div className="timer-slot">
            {timeLeft > 0 ? (
              <Timer seconds={timeLeft} />
            ) : resendingOtp ? (
              <Loader />
            ) : (
              <button className="otp-btn" onClick={resendOtp}>
                Resend
              </button>
            )}
          </div>
        </div>
      )}

      {verified && <p className="verified-text">✔ Email Verified</p>}
    </section>
  );
};

export default EmailVerification;
