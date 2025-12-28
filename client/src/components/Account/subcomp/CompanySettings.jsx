// 

import React, { useEffect, useState } from "react";
import api from "../../../API/axios";
import "./sub.css";

const CompanySettings = ({ company, setCompany }) => {
  const [form, setForm] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "",
      });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (company) {
      setForm({
        first_name: company.first_name || "",
        middle_name: company.middle_name || "",
        last_name: company.last_name || "",
        date_of_birth: company.date_of_birth || "",
        gender: company.gender || "",
       
      });
    }
  }, [company]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData();
    Object.keys(form).forEach((key) =>
      formData.append(key, form[key])
    );

    try {
      const res = await api.put("/company", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setCompany(res.data.data);
      setSuccess("Company details updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <form className="settings-form" onSubmit={handleSubmit}>
      <h3>Company Settings</h3>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <label>First Name</label>
      <input name="first_name" value={form.first_name} onChange={handleChange} required />

      <label>Middle Name</label>
      <input name="middle_name" value={form.middle_name} onChange={handleChange} />

      <label>Last Name</label>
      <input name="last_name" value={form.last_name} onChange={handleChange} required />

      <label>Date of Birth</label>
      <input
        type="date"
        name="date_of_birth"
        value={form.date_of_birth}
        onChange={handleChange}
      />
<label className="gender-label">Gender*</label>

<div className="gender-group">
  <label className="gender-option">
    <input
      type="radio"
      name="gender"
      value="Male"
      checked={form.gender === "Male"}
      onChange={handleChange}
    />
    <span>Male</span>
  </label>

  <label className="gender-option">
    <input
      type="radio"
      name="gender"
      value="Female"
      checked={form.gender === "Female"}
      onChange={handleChange}
    />
    <span>Female</span>
  </label>

  <label className="gender-option">
    <input
      type="radio"
      name="gender"
      value="Other"
      checked={form.gender === "Other"}
      onChange={handleChange}
    />
    <span>Others</span>
  </label>
</div>


      <button type="submit">Update</button>
    </form>
  );
};

export default CompanySettings;
