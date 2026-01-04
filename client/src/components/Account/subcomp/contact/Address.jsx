

import React, { useState } from "react";
import api from "../../../../API/axios";
import INDIAN_STATES from "../../../../constants/indianStates";
import Loader from "../../../Loader/Loader"; // ✅ ADDED
import "../sub.css";

const Address = () => {
  /* ============================
     STATE
  ============================ */
  const [form, setForm] = useState({
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    pincode: ""
  });

  const [loading, setLoading] = useState(false); // ✅ ADDED
  const [success, setSuccess] = useState("");   // ✅ ADDED
  const [error, setError] = useState("");       // ✅ ADDED

  /* ============================
     HANDLE CHANGE
  ============================ */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ============================
     SAVE ADDRESS
  ============================ */
  const handleSave = async () => {
    setError("");
    setSuccess("");

    if (!form.address_line1 || !form.city || !form.state || !form.pincode) {
      setError("All required fields must be filled");
      return;
    }

    try {
      setLoading(true); // ✅ SHOW LOADER

      const res = await api.put("/update-address", form);

      setSuccess(res.data.message || "Address updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update address");
    } finally {
      setLoading(false); // ✅ HIDE LOADER
    }
  };

  return (
    <section className="address-details">
      <h3>Address Details</h3>

      {/* ================= STATUS ================= */}
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      {/* ================= ADDRESS LINE 1 ================= */}
      <label>Address Line 1</label>
      <input
        name="address_line1"
        value={form.address_line1}
        onChange={handleChange}
      />

      {/* ================= ADDRESS LINE 2 ================= */}
      <label>Address Line 2</label>
      <input
        name="address_line2"
        value={form.address_line2}
        onChange={handleChange}
      />

      {/* ================= CITY + STATE + PINCODE ================= */}
      <div className="city-state-row">
        {/* LEFT COLUMN */}
        <div className="city-col">
          <label>City</label>
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
          />

          <label>Pincode</label>
          <div className="otp-row"> {/* ✅ REUSED FLEX ROW */}
            <input
              name="pincode"
              maxLength={6}
              value={form.pincode}
              onChange={handleChange}
            />

            {/* ✅ SAVE BUTTON NEXT TO PINCODE */}
           
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="state-col">
          <label>State</label>
          <select
            name="state"
            value={form.state}
            onChange={handleChange}
          >
            <option value="">Select State</option>
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
           <button
              type="button"
              className="verify-btn"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? <Loader /> : "Save"}
            </button>
        </div>
      </div>

    </section>
  );
};

export default Address;
