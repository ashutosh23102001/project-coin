import React, { useEffect, useState } from "react";
import api from "../../../API/axios";

const AddressSettings = ({ data, setData }) => {
  const [form, setForm] = useState({
    email: "",
    phone_number: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    pincode: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (data) {
      setForm({
        email: data.email || "",
        phone_number: data.phone_number || "",
        address_line1: data.address_line1 || "",
        address_line2: data.address_line2 || "",
        city: data.city || "",
        state: data.state || "",
        pincode: data.pincode || ""
      });
    }
  }, [data]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await api.put("/address", form);
      setData(res.data.data);
      setSuccess("Address details updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <form className="settings-form" onSubmit={handleSubmit}>
      <h3>Address Details</h3>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <label>Email</label>
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        required
      />

      <label>Phone Number</label>
      <input
        type="tel"
        name="phone_number"
        value={form.phone_number}
        onChange={handleChange}
      />

      <label>Address line 1</label>
      <input
        name="address_line1"
        value={form.address_line1}
        onChange={handleChange}
        required
      />

      <label>Address line 2 (optional)</label>
      <input
        name="address_line2"
        value={form.address_line2}
        onChange={handleChange}
      />

      <label>City</label>
      <input
        name="city"
        value={form.city}
        onChange={handleChange}
        required
      />

      <label>State</label>
      <input
        name="state"
        value={form.state}
        onChange={handleChange}
        required
      />

      <label>Pincode</label>
      <input
        name="pincode"
        value={form.pincode}
        onChange={handleChange}
        required
      />

      <button type="submit">Update</button>
    </form>
  );
};

export default AddressSettings;
