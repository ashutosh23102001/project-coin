import React, { useEffect, useState } from "react";
import api from "../../API/axios";
import "./Account.css";

const Account = () => {
  const [form, setForm] = useState({
    username: "",
    email: ""
  });

  const [msg, setMsg] = useState("");

  useEffect(() => {
    api.get("/account").then(res => {
      setForm(res.data);
    });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/account", form);
      setMsg(res.data.message);
    } catch (err) {
      setMsg(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="account-page">
      <h2>My Account</h2>

      <form onSubmit={handleSubmit}>
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
    </div>
  );
};

export default Account; // 🔥 THIS WAS MISSING
