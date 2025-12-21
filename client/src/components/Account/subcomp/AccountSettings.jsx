import React, { useEffect, useState } from "react";
import api from "../../../API/axios";

const AccountSettings = () => {
  const [form, setForm] = useState({
    username: "",
    email: ""
  });

  const [msg, setMsg] = useState("");

  useEffect(() => {
    api.get("/account")
      .then(res => setForm(res.data))
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/account", form);
      setMsg(res.data.message || "Updated successfully");
    } catch {
      setMsg("Update failed");
    }
  };

  return (
    <form className="settings-form" onSubmit={handleSubmit}>
      <h3>Account Settings</h3>

      <label>Username</label>
      <input
        name="username"
        value={form.username}
        onChange={handleChange}
      />

      <label>Email</label>
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
      />

      <button type="submit">Update</button>
      {msg && <p>{msg}</p>}
    </form>
  );
};

export default AccountSettings;
