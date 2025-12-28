import React, { useEffect, useState } from "react";
import api from "../../../API/axios";
import "./sub.css";

const CompanySettings = ({ company }) => {
  const [form, setForm] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    date_of_birth: "",
    gender: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* Load existing data */
  useEffect(() => {
    if (company) {
      setForm({
        first_name: company.first_name || "",
        middle_name: company.middle_name || "",
        last_name: company.last_name || "",
        date_of_birth: company.date_of_birth || "",
        gender: company.gender || ""
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

    console.log("SENDING:", form);

    try {
      const res = await api.put("/company", form);
      setSuccess(res.data.message);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <form className="settings-form" onSubmit={handleSubmit}>
      <h3>Personal Settings</h3>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <label>First Name</label>
      <input
        name="first_name"
        value={form.first_name}
        onChange={handleChange}
        required
      />

      <label>Middle Name</label>
      <input
        name="middle_name"
        value={form.middle_name}
        onChange={handleChange}
      />

      <label>Last Name</label>
      <input
        name="last_name"
        value={form.last_name}
        onChange={handleChange}
        required
      />

      {/* DOB + Gender */}
      <div className="dob-gender-row">
        <div className="dob-col">
          <label>Date of Birth</label>
          <input
            type="date"
            name="date_of_birth"
            value={form.date_of_birth}
            onChange={handleChange}
          />
        </div>

        <div className="gender-col">
          <label>Gender*</label>
          <div className="gender-group">
            <label>
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={form.gender === "Male"}
                onChange={handleChange}
              /> Male
            </label>

            <label>
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={form.gender === "Female"}
                onChange={handleChange}
              /> Female
            </label>

            <label>
              <input
                type="radio"
                name="gender"
                value="Other"
                checked={form.gender === "Other"}
                onChange={handleChange}
              /> Others
            </label>
          </div>
        </div>
      </div>

      <button type="submit">Update</button>
    </form>
  );
};

export default CompanySettings;
