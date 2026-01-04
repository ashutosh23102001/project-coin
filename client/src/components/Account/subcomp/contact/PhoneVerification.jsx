import React, { useState } from "react";
import api from "../../../../API/axios";
import "../sub.css";

const PhoneVerification = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [sent, setSent] = useState(false);

  const sendOtp = async () => {
    await api.post("/send-phone-otp", { phone });
    setSent(true);
  };

  const verifyOtp = async () => {
    await api.post("/verify-phone-otp", { phone, otp });
    alert("Phone verified");
  };

  return (
    <section className="phone">
      <label>Phone Number</label>

      <div className="otp-row">
        <input value={phone} onChange={e => setPhone(e.target.value)} />
        {!sent && (
          <button type="button" className="otp-btn" onClick={sendOtp}>
            Send OTP
          </button>
        )}
      </div>

      {sent && (
        <div className="otp-row otp-verify">
          <input
            placeholder="Enter OTP"
            value={otp}
            onChange={e => setOtp(e.target.value)}
          />
          <button type="button" className="verify-btn" onClick={verifyOtp}>
            Verify
          </button>
        </div>
      )}
    </section>
  );
};

export default PhoneVerification;
