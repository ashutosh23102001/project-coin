

// import React, { useState, useEffect } from "react";
// import api from "../../../../API/axios";
// import INDIAN_STATES from "../../../../constants/indianStates";
// import Loader from "../../../Loader/Loader";
// import "../sub.css";

// const Address = () => {
//   /* ============================
//      STATE
//   ============================ */
//   const [form, setForm] = useState({
//     address_line1: "",
//     address_line2: "",
//     city: "",
//     state: "",
//     pincode: ""
//   });

//   const [isEditing, setIsEditing] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState("");
//   const [error, setError] = useState("");

//   /* ============================
//      🔹 FETCH ADDRESS ON LOAD
//   ============================ */
//   useEffect(() => {
//     api
//       .get("/address")
//       .then(res => {
//         const data = res.data || {};

//         /* ✅ NULL-SAFE NORMALIZATION */
//         setForm({
//           address_line1: data.address_line1 || "",
//           address_line2: data.address_line2 || "",
//           city: data.city || "",
//           state: data.state || "",
//           pincode: data.pincode || ""
//         });
//       })
//       .catch(() => {
//         setError("Failed to load address");
//       });
//   }, []);

//   /* ============================
//      HANDLE CHANGE
//   ============================ */
//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   /* ============================
//      SAVE ADDRESS
//   ============================ */
//   const handleSave = async () => {
//     setError("");
//     setSuccess("");

//     try {
//       setLoading(true);
//       const res = await api.put("/update-address", form);
//       setSuccess(res.data.message);
//       setIsEditing(false);
//     } catch (err) {
//       setError(err.response?.data?.message || "Update failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <section className="address-details">
//       <h3>Address Details</h3>

//       {error && <p className="error">{error}</p>}
//       {success && <p className="success">{success}</p>}

//       <label>Address Line 1</label>
//       <input
//         name="address_line1"
//         value={form.address_line1}
//         onChange={handleChange}
//         disabled={!isEditing}
//       />

//       <label>Address Line 2</label>
//       <input
//         name="address_line2"
//         value={form.address_line2}
//         onChange={handleChange}
//         disabled={!isEditing}
//       />

//       <div className="city-state-row">
//         <div className="city-col">
//           <label>City</label>
//           <input
//             name="city"
//             value={form.city}
//             onChange={handleChange}
//             disabled={!isEditing}
//           />

//           <label>Pincode</label>
//           <input
//             name="pincode"
//             maxLength={6}
//             value={form.pincode}
//             onChange={handleChange}
//             disabled={!isEditing}
//           />
//         </div>

//         <div className="state-col">
//           <label>State</label>
//           <select
//             name="state"
//             value={form.state}
//             onChange={handleChange}
//             disabled={!isEditing}
//           >
//             <option value="">Select State</option>
//             {INDIAN_STATES.map(s => (
//               <option key={s} value={s}>
//                 {s}
//               </option>
//             ))}
//           </select>

//           {!isEditing ? (
//             <button
//               type="button"
//               className="verify-btn"
//               onClick={() => setIsEditing(true)}
//             >
//               Edit
//             </button>
//           ) : (
//             <button
//               type="button"
//               className="verify-btn"
//               onClick={handleSave}
//               disabled={loading}
//             >
//               {loading ? <Loader /> : "Save"}
//             </button>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Address;


import React, { useState, useEffect } from "react";
import api from "../../../../API/axios";
import INDIAN_STATES from "../../../../constants/indianStates";
import Loader from "../../../Loader/Loader";
import "../sub.css";

const Address = () => {
  const [form, setForm] = useState({
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    pincode: ""
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  /* ================= FETCH ================= */
  useEffect(() => {
    api
      .get("/address") // 🔴 FIX: correct endpoint
      .then(res => {
        const data = res.data || {};

        setForm({
          address_line1: data.address_line1 || "",
          address_line2: data.address_line2 || "",
          city: data.city || "",
          state: data.state || "",
          pincode: data.pincode || ""
        });
      })
      .catch(err => {
        console.log(err); // 🔴 DEBUG
        setError("Failed to load address");
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    setError("");
    setSuccess("");

    try {
      setLoading(true);

      const res = await api.put("/address", form); // 🔴 FIX

      setSuccess(res.data.message);
      setIsEditing(false);
    } catch (err) {
      console.log(err); // 🔴 DEBUG
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="address-details">
      <h3>Address Details</h3>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <label>Address Line 1</label>
      <input
        name="address_line1"
        value={form.address_line1}
        onChange={handleChange}
        disabled={!isEditing}
      />

      <label>Address Line 2</label>
      <input
        name="address_line2"
        value={form.address_line2}
        onChange={handleChange}
        disabled={!isEditing}
      />

      <div className="city-state-row">
        <div className="city-col">
          <label>City</label>
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            disabled={!isEditing}
          />

          <label>Pincode</label>
          <input
            name="pincode"
            maxLength={6}
            value={form.pincode}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div className="state-col">
          <label>State</label>
          <select
            name="state"
            value={form.state}
            onChange={handleChange}
            disabled={!isEditing}
          >
            <option value="">Select State</option>
            {INDIAN_STATES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {!isEditing ? (
            <button onClick={() => setIsEditing(true)}>Edit</button>
          ) : (
            <button onClick={handleSave} disabled={loading}>
              {loading ? <Loader /> : "Save"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default Address;