// import React, { useEffect, useState } from "react";
// import api from "../../../API/axios";

// const AccountSettings = ({ user, setUser }) => {
//   const [form, setForm] = useState({
//     username: "",
//     password: "",
//     confirmPassword: ""
//   });

//   // Populate username when user data is available
//   useEffect(() => {
//     if (user) {
//       setForm((prev) => ({
//         ...prev,
//         username: user.username || ""
//       }));
//     }
//   }, [user]);

//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // 🔒 Password validation
//     if (form.password !== form.confirmPassword) {
//       alert("Passwords do not match");
//       return;
//     }

//     try {
//       const res = await api.put("/account", {
//         username: form.username,
//         password: form.password
//       });

//       // 🔥 Update shared user state
//       setUser((prev) => ({
//         ...prev,
//         username: form.username
//       }));

//       alert(res.data.message);

//       // Clear password fields
//       setForm((prev) => ({
//         ...prev,
//         password: "",
//         confirmPassword: ""
//       }));
//     } catch (err) {
//       alert(err.response?.data?.message || "Update failed");
//     }
//   };

//   return (
//     <form className="settings-form" onSubmit={handleSubmit}>
//       <h3>Account Settings</h3>

//       <label>Username</label>
//       <input
//         type="text"
//         name="username"
//         value={form.username}
//         onChange={handleChange}
//         required
//       />

//       <label>New Password</label>
//       <input
//         type="password"
//         name="password"
//         value={form.password}
//         onChange={handleChange}
//         required
//       />

//       <label>Confirm Password</label>
//       <input
//         type="password"
//         name="confirmPassword"
//         value={form.confirmPassword}
//         onChange={handleChange}
//         required
//       />

//       <button type="submit">Update</button>
//     </form>
//   );
// };

// export default AccountSettings;

// import React, { useState } from "react";
// import api from "../../../API/axios";


// const AccountSettings = ({ user, setUser }) => {
//   const [username, setUsername] = useState(user?.username || "");
//   const [oldPassword, setOldPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const showNewPasswordFields = oldPassword.length > 0;

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (!oldPassword) {
//       setError("Old password is required");
//       return;
//     }

//     if (newPassword && newPassword !== confirmPassword) {
//       setError("New passwords do not match");
//       return;
//     }

//     try {
//       const res = await api.put("/account", {
//         username,
//         oldPassword,
//         newPassword
//       });

//       setUser((prev) => ({ ...prev, username }));
//       setOldPassword("");
//       setNewPassword("");
//       setConfirmPassword("");

//       setSuccess(res.data.message);
//     } catch (err) {
//       setError(err.response?.data?.message || "Update failed");
//     }
//   };

//   return (
//     <form className="settings-form" onSubmit={handleSubmit}>
//       <h3>Account Settings</h3>

//       {error && <p style={{ color: "red" }}>{error}</p>}
//       {success && <p style={{ color: "green" }}>{success}</p>}

//       <label>Username</label>
//       <input
//         type="text"
//         value={username}
//         onChange={(e) => setUsername(e.target.value)}
//         required
//       />

//       <label>Old Password</label>
//       <input
//         type="password"
//         value={oldPassword}
//         onChange={(e) => setOldPassword(e.target.value)}
//         required
//       />

//       {showNewPasswordFields && (
//         <>
//           <label>New Password</label>
//           <input
//             type="password"
//             value={newPassword}
//             onChange={(e) => setNewPassword(e.target.value)}
//           />

//           <label>Confirm New Password</label>
//           <input
//             type="password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//           />
//         </>
//       )}

//       <button type="submit">Update</button>
//     </form>
//   );
// };

// export default AccountSettings;

// import React, { useState } from "react";
// import api from "../../../API/axios";
// import "./sub.css"
// const AccountSettings = ({ user, setUser }) => {
// //   const [username, setUsername] = useState(user?.username || "");
//   const [oldPassword, setOldPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
// //   const [usernameLoading, setUsernameLoading] = useState(false);

//   const showNewPasswordFields = oldPassword.length > 0;

  // =======================
  // UPDATE USERNAME ONLY
  // =======================
//   const handleUsernameUpdate = async () => {
//     setError("");
//     setSuccess("");
//     setUsernameLoading(true);

//     try {
//       const res = await api.put("/account/username", { username });

//       // 🔁 update parent + UI
//       setUser((prev) => ({ ...prev, username: res.data.username }));
//       setSuccess("Username updated successfully");
//     } catch (err) {
//       setError(err.response?.data?.message || "Username not available");
//     } finally {
//       setUsernameLoading(false);
//     }
//   };

  // =======================
  // UPDATE PASSWORD
  // =======================

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (!oldPassword) {
//       setError("Old password is required");
//       return;
//     }

//     if (newPassword && newPassword !== confirmPassword) {
//       setError("New passwords do not match");
//       return;
//     }

//     try {
//       const res = await api.put("/account", {
//         oldPassword,
//         newPassword
//       });

//       setOldPassword("");
//       setNewPassword("");
//       setConfirmPassword("");

//       setSuccess(res.data.message);
//     } catch (err) {
//       setError(err.response?.data?.message || "Update failed");
//     }
//   };

//   return (
//     <form className="settings-form" onSubmit={handleSubmit}>
//       <h3>Account Settings</h3>

//       {error && <p style={{ color: "red" }}>{error}</p>}
//       {success && <p style={{ color: "green" }}>{success}</p>}

//       {/* PASSWORD */}
//       <label>Old Password</label>
//       <input
//         type="password"
//         value={oldPassword}
//         onChange={(e) => setOldPassword(e.target.value)}
//         required
//       />

//       {showNewPasswordFields && (
//         <>
//           <label>New Password</label>
//           <input
//             type="password"
//             value={newPassword}
//             onChange={(e) => setNewPassword(e.target.value)}
//           />

//           <label>Confirm New Password</label>
//           <input
//             type="password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//           />
//         </>
//       )}

//       <button type="submit">Update Password</button>
//     </form>
//   );
// };

// export default AccountSettings;


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
