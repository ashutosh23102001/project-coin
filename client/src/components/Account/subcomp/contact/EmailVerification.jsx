
import { useEffect, useState } from "react";
import api from "../../../../API/axios";
import Loader from "../../../Loader/Loader";
import Timer from "../../../Timer/Timer";
import "../sub.css";

const EmailVerification = ({ email, setEmail }) => {
  const [editMode, setEditMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [resendingOtp, setResendingOtp] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [emailFetched, setEmailFetched] = useState(false); // ✅ ADD

  /* ================= FETCH EMAIL ONCE ================= */
  useEffect(() => {
    if (emailFetched) return; // 🔒 prevent overwrite

    api.get("/get-email")
      .then(res => {
        setEmail(res.data.email || "");
        setEmailFetched(true);
        setEditMode(false);
      })
      .catch(() => setEmailFetched(true));
  }, [emailFetched, setEmail]);

  /* ================= TIMER ================= */
  useEffect(() => {
    if (!otpSent || timeLeft <= 0) return;
    const t = setInterval(() => setTimeLeft(v => v - 1), 1000);
    return () => clearInterval(t);
  }, [otpSent, timeLeft]);

  const onEdit = () => {
    setEditMode(true);
    setVerified(false);
    setOtp("");
    setOtpSent(false);
    setTimeLeft(0);
  };

  const sendOtp = async () => {
    if (!email) return alert("Enter email");

    try {
      setSendingOtp(true);
      await api.post("/send-email-otp", { email });
      setOtpSent(true);
      setEditMode(false);
      setTimeLeft(60);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  const resendOtp = async () => {
    try {
      setResendingOtp(true);
      await api.post("/send-email-otp", { email });
      setTimeLeft(60);
      setOtp("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResendingOtp(false);
    }
  };

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

      <div className="otp-row">
        <input
          value={email ?? ""}  
          onChange={e => setEmail(e.target.value)}
          disabled={!editMode}
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
