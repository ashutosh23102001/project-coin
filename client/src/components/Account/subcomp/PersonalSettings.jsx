// import React, { useEffect, useState } from "react";
// import api from "../../../API/axios";
// import "./sub.css";

// const PersonalSettings = ({ company }) => {
//   const [form, setForm] = useState({
//     first_name: "",
//     middle_name: "",
//     last_name: "",
//     date_of_birth: "",
//     gender: ""
//   });

// const [isEditing, setIsEditing] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");


//   /* Load existing data */
//   useEffect(() => {
//     if (company) {
//       setForm({
//         first_name: company.first_name || "",
//         middle_name: company.middle_name || "",
//         last_name: company.last_name || "",
//         date_of_birth: company.date_of_birth || "",
//         gender: company.gender || ""
//       });
//     }
//   }, [company]);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     console.log("SENDING:", form);

//     try {
//       const res = await api.put("/company", form);
//       setSuccess(res.data.message);
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.message || "Update failed");
//     }
//   };

//   return (
//     <form className="settings-form" onSubmit={handleSubmit}>
//       <h3>Personal Settings</h3>

//       {error && <p style={{ color: "red" }}>{error}</p>}
//       {success && <p style={{ color: "green" }}>{success}</p>}

//       <label>First Name</label>
//       <input
//         name="first_name"
//         value={form.first_name}
//         onChange={handleChange}
//         required
//       />

//       <label>Middle Name</label>
//       <input
//         name="middle_name"
//         value={form.middle_name}
//         onChange={handleChange}
//       />

//       <label>Last Name</label>
//       <input
//         name="last_name"
//         value={form.last_name}
//         onChange={handleChange}
//         required
//       />

//       {/* DOB + Gender */}
//       <div className="dob-gender-row">
//         <div className="dob-col">
//           <label>Date of Birth</label>
//           <input
//             type="date"
//             name="date_of_birth"
//             value={form.date_of_birth}
//             onChange={handleChange}
//           />
//         </div>

//         <div className="gender-col">
//           <label>Gender*</label>
//           <div className="gender-group">
//             <label>
//               <input
//                 type="radio"
//                 name="gender"
//                 value="Male"
//                 checked={form.gender === "Male"}
//                 onChange={handleChange}
//               /> Male
//             </label>

//             <label>
//               <input
//                 type="radio"
//                 name="gender"
//                 value="Female"
//                 checked={form.gender === "Female"}
//                 onChange={handleChange}
//               /> Female
//             </label>

//             <label>
//               <input
//                 type="radio"
//                 name="gender"
//                 value="Other"
//                 checked={form.gender === "Other"}
//                 onChange={handleChange}
//               /> Others
//             </label>
//           </div>
//         </div>
//       </div>

//       <button type="submit">Update</button>
//     </form>
//   );
// };

// export default PersonalSettings;


// part 2


// import React, { useEffect, useState } from "react";
// import api from "../../../API/axios";
// import "./sub.css";

// const PersonalSettings = () => {
//   const [form, setForm] = useState({
//     first_name: "",
//     middle_name: "",
//     last_name: "",
//     date_of_birth: "",
//     gender: ""
//   });

//   const [isEditing, setIsEditing] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   /* ================= FETCH ================= */
//   useEffect(() => {
//     api
//       .get("/company")
//       .then(res => {
//         setForm({
//           ...res.data,
//           date_of_birth: res.data.date_of_birth || ""
//         });
//       })
//       .catch(() => setError("Failed to load data"))
//       .finally(() => setLoading(false));
//   }, []);

//   const handleChange = e =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   /* ================= SUBMIT ================= */
//   const handleSubmit = async e => {
//     e.preventDefault();

//     if (!isEditing) {
//       setIsEditing(true);
//       return;
//     }

//     try {
//       const res = await api.put("/company", form);
//       setSuccess(res.data.message);
//       setIsEditing(false);
//     } catch {
//       setError("Update failed");
//     }
//   };

//   if (loading) return <p>Loading...</p>;

//   return (
//     <form className="settings-form" onSubmit={handleSubmit}>
//       <h3>Personal Settings</h3>

//       {error && <p style={{ color: "red" }}>{error}</p>}
//       {success && <p style={{ color: "green" }}>{success}</p>}

//       <label>First Name</label>
//       <input
//         name="first_name"
//         value={form.first_name}
//         disabled={!isEditing}
//         onChange={handleChange}
//       />

//       <label>Middle Name</label>
//       <input
//         name="middle_name"
//         value={form.middle_name}
//         disabled={!isEditing}
//         onChange={handleChange}
//       />

//       <label>Last Name</label>
//       <input
//         name="last_name"
//         value={form.last_name}
//         disabled={!isEditing}
//         onChange={handleChange}
//       />

//       <label>Date of Birth</label>
//       <input
//         type="date"
//         name="date_of_birth"
//         value={form.date_of_birth}
//         disabled={!isEditing}
//         onChange={handleChange}
//       />

//       <label>Gender</label>
//       {["Male", "Female", "Other"].map(g => (
//         <label key={g} style={{ marginRight: "15px" }}>
//           <input
//             type="radio"
//             name="gender"
//             value={g}
//             checked={form.gender === g}
//             disabled={!isEditing}
//             onChange={handleChange}
//           />
//           {g}
//         </label>
//       ))}

//       <button type="submit">
//         {isEditing ? "Update" : "Edit"}
//       </button>
//     </form>
//   );
// };

// export default PersonalSettings;



// part 3
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
          ...res.data,
          date_of_birth: res.data.date_of_birth || ""
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
      return;
    }

    try {
      const res = await api.put("/company", form);
      setSuccess(res.data.message);
      setIsEditing(false);
    } catch {
      setError("Update failed");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <form className="settings-form" onSubmit={handleSubmit}>
      <h3>Personal Settings</h3>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      {/* ---------- First Name ---------- */}
      <label>First Name</label>
      <input
        name="first_name"
        value={form.first_name || ""}
        disabled={!isEditing}
        onChange={handleChange}
      />

      {/* ---------- Middle Name ---------- */}
      <label>Middle Name</label>
      <input
        name="middle_name"
        value={form.middle_name || ""}
        disabled={!isEditing}
        onChange={handleChange}
      />

      {/* ---------- Last Name ---------- */}
      <label>Last Name</label>
      <input
        name="last_name"
        value={form.last_name || ""}
        disabled={!isEditing}
        onChange={handleChange}
      />

      {/* ---------- DOB + GENDER ROW ---------- */}
      <div className="dob-gender-row">

        {/* DOB */}
        <div className="dob-col">
          <label>Date of Birth</label>
          <input
            type="date"
            name="date_of_birth"
            value={form.date_of_birth || ""}
            disabled={!isEditing}
            onChange={handleChange}
          />
        </div>

        {/* GENDER */}
        <div className="gender-col">
          <label>Gender</label>

          {!isEditing && (
            <input value={form.gender || ""} disabled />
          )}

          {isEditing && (
            <div className="gender-group">
              {["Male", "Female", "Other"].map(g => (
                <label key={g} className="gender-option">
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
