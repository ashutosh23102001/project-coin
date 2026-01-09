
import React, { useState, useEffect } from "react";
import api from "../../API/axios";
import { useNavigate ,Link } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [step, setStep] = useState(1); // 1=user, 2=otp, 3=password
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ============= HELPERS ============= */
  const maskEmail = (email) => {
    const [name, domain] = email.split("@");
    return name.slice(0, 5) + "***@" + domain;
  };

  /* ============= TIMER ============= */
  useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [timer]);

  /* ============= SEND OTP ============= */
  const sendOtp = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // get email by username
      const emailRes = await api.post("/forgot-password/get-email", {
        username
      });

      const userEmail = emailRes.data.email;
      setEmail(userEmail);
      setMaskedEmail(maskEmail(userEmail));

      // send otp
      await api.post("/send-email-otp", { email: userEmail });

      setTimer(60);
      setStep(2);
      setSuccess("OTP sent to registered email");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ============= VERIFY OTP ============= */
  const verifyOtp = async () => {
    try {
      setLoading(true);
      setError("");

      await api.post("/forgot-password/verify-otp", {
        email,
        otp
      });

      setSuccess("OTP verified");
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ============= RESET PASSWORD ============= */
  const resetPassword = async () => {
    if (newPassword !== confirmPassword)
      return setError("Passwords do not match");

    try {
      setLoading(true);
      setError("");

      await api.post("/forgot-password/reset", {
        username,
        newPassword
      });

      setSuccess("Password updated successfully");

      setTimeout(() => navigate("/login"), 2000);
    } catch {
      setError("Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  /* ============= UI ============= */
  return (
    <div className="fp-wrapper">
      <div className="fp-card">
      
        <div className="fp-left">
          <h2>Forgot Password</h2>

          {error && <p className="fp-error">{error}</p>}
          {success && <p className="fp-success">{success}</p>}

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
              <button onClick={sendOtp} disabled={loading}>
                {loading ? <Loader /> : "Send OTP"}
              </button>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <p className="masked-email">
                 <b>{maskedEmail}</b>
              </p>

              <input
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={loading}
              />

              <button onClick={verifyOtp} disabled={loading}>
                {loading ? <Loader /> : "Verify OTP"}
              </button>

              <button
                className="resend"
                disabled={timer > 0 || loading}
                onClick={sendOtp}
              >
                {loading
                  ? <Loader />
                  : timer > 0
                  ? `Resend OTP in ${timer}s`
                  : "Resend OTP"}
              </button>
            </>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <>
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
              <button onClick={resetPassword} disabled={loading}>
                {loading ? <Loader /> : "Update Password"}
              </button>
            </>
          )}
        </div>
          
        <div className="fp-right">{/* Ad space */}
        <Link to="/" className="popup-close-btn">
    &times;
  </Link>
        </div>
          
      </div>
    </div>
  );
};

export default ForgotPassword;
