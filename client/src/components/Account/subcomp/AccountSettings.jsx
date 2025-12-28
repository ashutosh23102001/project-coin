

import React, { useState } from "react";
import api from "../../../API/axios";

const AccountSettings = ({ user, setUser }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showNewPasswordFields, setShowNewPasswordFields] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!oldPassword) {
      setError("Old password is required");
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    try {
      const res = await api.put("/account", {
        oldPassword,
        newPassword
      });

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setSuccess(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <form className="settings-form" onSubmit={handleSubmit}>
      <h3>Account Settings</h3>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      {/* OLD PASSWORD */}
      <label>Old Password</label>
      <input
        type="password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        required
      />

      {showNewPasswordFields && (
        <>
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <label>Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </>
      )}

      <button type="submit">Update Password</button>
    </form>
  );
};

export default AccountSettings;
