
import React, { useState } from "react";
import api from "../../../API/axios";
import INDIAN_STATES from "../../../constants/indianStates";
import "./sub.css";

const isValidPincode = /^[1-9][0-9]{5}$/;

const AddressDetails = () => {
  const [form, setForm] = useState({
    email: "",
    phone: "",
    emailOtp: "",
    phoneOtp: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    pincode: ""
  });

  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });
const sendEmailOtp = async () => {
  try {
    await api.post("/send-email-otp", { email: form.email });
    setEmailOtpSent(true);
    alert("OTP sent to email");
  } catch (err) {
    alert(err.response?.data?.message || "Failed to send OTP");
  }
};

const verifyEmailOtp = async () => {
  try {
    await api.post("/verify-email-otp", {
      email: form.email,
      otp: form.emailOtp
    });

    setEmailVerified(true);     // ✅ MARK VERIFIED
    setEmailOtpSent(false);    // ✅ HIDE OTP INPUT
    alert("Email verified");
  } catch (err) {
    alert(err.response?.data?.message || "OTP verification failed");
  }
};


  /* -------- PHONE OTP -------- */
  const sendPhoneOtp = async () => {
    await api.post("/send-phone-otp", { phone: form.phone });
    setPhoneOtpSent(true);
  };

  const verifyPhoneOtp = async () => {
    await api.post("/verify-phone-otp", {
      phone: form.phone,
      otp: form.phoneOtp
    });
    alert("Phone verified");
  };

  /* 🔴 SUBMIT HANDLER */
const handleSubmit = async e => {
  e.preventDefault();

  if (!isValidPincode.test(form.pincode)) {
    alert("Please enter a valid 6-digit Indian pincode");
    return;
  }

  try {
    await api.put("/update-address", {
      email: form.email,
      phone: form.phone, 
          // 🔴 MATCH BACKEND
      address_line1: form.address_line1,
      address_line2: form.address_line2,
      city: form.city,
      state: form.state,
      pincode: form.pincode
    });

    alert("Address updated successfully");
  } catch (err) {
    alert("Failed to update address");
  }
};

  return (
    <form className="settings-form" onSubmit={handleSubmit}>
      <h3>Address Details</h3>
{/* ================= EMAIL ================= */}
<label>Email</label>

<div className="otp-row">
  <input
    name="email"
    value={form.email}
    onChange={handleChange}
    disabled={emailVerified}   // ✅ lock email after verified
  />

  {/* SEND OTP BUTTON */}
  {!emailOtpSent && !emailVerified && (
    <button
      type="button"
      className="otp-btn"
      onClick={sendEmailOtp}
    >
      Send OTP
    </button>
  )}
</div>

{/* OTP INPUT + VERIFY BUTTON */}
{emailOtpSent && !emailVerified && (
  <div className="otp-row otp-verify">
    <input
      name="emailOtp"
      placeholder="Enter OTP"
      value={form.emailOtp}
      onChange={handleChange}
    />
    <button
      type="button"
      className="verify-btn"
      onClick={verifyEmailOtp}
    >
      Verify
    </button>
  </div>
)}

{/* VERIFIED TEXT */}
{emailVerified && (
  <div className="verified-text">
    ✔ Email Verified
  </div>
)}



      {/* ================= PHONE ================= */}
      <label>Phone Number</label>
      <div className="otp-row">
        <input name="phone" value={form.phone} onChange={handleChange} />
        {!phoneOtpSent && (
          <button type="button" className="otp-btn" onClick={sendPhoneOtp}>
            Send OTP
          </button>
        )}
      </div>

      {phoneOtpSent && (
        <div className="otp-row otp-verify">
          <input
            name="phoneOtp"
            placeholder="Enter OTP"
            value={form.phoneOtp}
            onChange={handleChange}
          />
          <button type="button" className="verify-btn" onClick={verifyPhoneOtp}>
            Verify
          </button>
        </div>
      )}

      {/* ---------- ADDRESS LINE 1 + LINE 2 ---------- */}
<div className="address-row">
  <div className="address-col">
    <label>Address Line 1</label>
    <input
      name="address_line1"
      value={form.address_line1}
      onChange={handleChange}
      placeholder="House no, Street, Area"
    />
  </div>

  <div className="address-col">
    <label>Address Line 2</label>
    <input
      name="address_line2"
      value={form.address_line2}
      onChange={handleChange}
      placeholder="Landmark (optional)"
    />
  </div>
</div>




      {/* ---------- CITY + STATE ---------- */}
      <div className="city-state-row">
        <div className="city-col">
          <label>City</label>
          <input name="city" value={form.city} onChange={handleChange} />
        </div>

        <div className="state-col">
          <label>State</label>
          <select name="state" value={form.state} onChange={handleChange}>
            <option value="">Select State</option>
            {INDIAN_STATES.map(state => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ---------- PINCODE ---------- */}
      <label>Pincode</label>
      <input
        name="pincode"
        value={form.pincode}
        onChange={handleChange}
        maxLength={6}
        placeholder="Enter 6-digit pincode"
      />

      <button type="submit">Update</button>
    </form>
  );
};

export default AddressDetails;
