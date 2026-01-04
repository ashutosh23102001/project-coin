

import React, { useEffect, useState } from "react";
import api from "../../../API/axios";
import "./sub.css";

const PersonalSettings = () => {
  const [form, setForm] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    date_of_birth: "",
    gender: ""
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ================= FETCH ================= */
  useEffect(() => {
    api
      .get("/company")
      .then(res => {
        setForm({
          first_name: res.data.first_name || "",
          middle_name: res.data.middle_name || "",
          last_name: res.data.last_name || "",
          date_of_birth: 
          res.data.date_of_birth &&
          res.data.date_of_birth !== "0000-00-00"
            ? res.data.date_of_birth
            : "",
          gender: res.data.gender || ""
        });
      })
      .catch(() => setError("Failed to load data"))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ================= SUBMIT ================= */
  const handleSubmit = async e => {
    e.preventDefault();

    if (!isEditing) {
      setIsEditing(true);
      setSuccess("");
      return;
    }

    try {
      const res = await api.put("/company", form);
      setSuccess(res.data.message);
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <form className="settings-form" onSubmit={handleSubmit}>
      <h3>Personal Settings</h3>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <label>First Name</label>
      <input
        name="first_name"
        value={form.first_name}
        disabled={!isEditing}
        onChange={handleChange}
      />

      <label>Middle Name</label>
      <input
        name="middle_name"
        value={form.middle_name}
        disabled={!isEditing}
        onChange={handleChange}
      />

      <label>Last Name</label>
      <input
        name="last_name"
        value={form.last_name}
        disabled={!isEditing}
        onChange={handleChange}
      />

      <div className="dob-gender-row">
        <div className="dob-col">
          <label>Date of Birth</label>
          <input
            type="date"
            name="date_of_birth"
            value={form.date_of_birth}
            disabled={!isEditing}
            onChange={handleChange}
          />
        </div>

        <div className="gender-col">
          <label>Gender</label>

          {!isEditing && <input value={form.gender} disabled />}

          {isEditing && (
            <div className="gender-group">
              {["Male", "Female", "Other"].map(g => (
                <label key={g}>
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={form.gender === g}
                    onChange={handleChange}
                  />
                  {g}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      <button type="submit">
        {isEditing ? "Update" : "Edit"}
      </button>
    </form>
  );
};

export default PersonalSettings;
