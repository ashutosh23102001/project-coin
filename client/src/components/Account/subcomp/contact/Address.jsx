

// import React, { useState ,useEffect  } from "react";
// import api from "../../../../API/axios";
// import INDIAN_STATES from "../../../../constants/indianStates";
// import Loader from "../../../Loader/Loader"; // ✅ ADDED
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

//     const [isEditing, setIsEditing] = useState(false); // ✅ ADDED

//   const [loading, setLoading] = useState(false); // ✅ ADDED
//   const [success, setSuccess] = useState("");   // ✅ ADDED
//   const [error, setError] = useState("");       // ✅ ADDED



//   /* ============================
//      🔹 FETCH ADDRESS ON LOAD
//   ============================ */
//   useEffect(() => {
//     api
//       .get("/address") // ✅ ADDED
//       .then(res => {
//         setForm(res.data);
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

// try {
//       setLoading(true);
//       const res = await api.put("/update-address", form);
//       setSuccess(res.data.message);
//       setIsEditing(false); // ✅ DISABLE AFTER SAVE
//     } catch (err) {
//       setError(err.response?.data?.message || "Update failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <section className="address-details">
//       <h3>Address Details</h3>

//       {/* ================= STATUS ================= */}
//       {error && <p className="error">{error}</p>}
//       {success && <p className="success">{success}</p>}

//       {/* ================= ADDRESS LINE 1 ================= */}
//       <label>Address Line 1</label>
//       <input
//         name="address_line1"
//         value={form.address_line1}
//         onChange={handleChange}
//                 disabled={!isEditing}   // ✅ ADDED

//       />

//       {/* ================= ADDRESS LINE 2 ================= */}
//       <label>Address Line 2</label>
//       <input
//         name="address_line2"
//         value={form.address_line2}
//         onChange={handleChange}
//                 disabled={!isEditing}   // ✅ ADDED

//       />

//       {/* ================= CITY + STATE + PINCODE ================= */}
//       <div className="city-state-row">
//         {/* LEFT COLUMN */}
//         <div className="city-col">
//           <label>City</label>
//           <input
//             name="city"
//             value={form.city}
//             onChange={handleChange}
//                     disabled={!isEditing}   // ✅ ADDED

//           />

//           <label>Pincode</label>
//           <div className="otp-row"> {/* ✅ REUSED FLEX ROW */}
//             <input
//               name="pincode"
//               maxLength={6}
//               value={form.pincode}
//               onChange={handleChange}

//                       disabled={!isEditing}   // ✅ ADDED

//             />

//             {/* ✅ SAVE BUTTON NEXT TO PINCODE */}
           
//           </div>
//         </div>

//         {/* RIGHT COLUMN */}
//         <div className="state-col">
//           <label>State</label>
//           <select
//             name="state"
//             value={form.state}
//             onChange={handleChange}
//                     disabled={!isEditing}   // ✅ ADDED

//           >
//             <option value="">Select State</option>
//             {INDIAN_STATES.map((s) => (
//               <option key={s} value={s}>
//                 {s}
//               </option>
//             ))}
//           </select>
//            {!isEditing ? (
//   /* ================= EDIT MODE BUTTON ================= */
//   <button
//     type="button"
//     className="verify-btn"
//     onClick={() => setIsEditing(true)}   // ✅ ENABLE EDITING
//   >
//     Edit
//   </button>
// ) : (
//   /* ================= SAVE MODE BUTTON ================= */
//   <button
//     type="button"
//     className="verify-btn"
//     onClick={handleSave}                 // ✅ SAVE DATA
//     disabled={loading}
//   >
//     {loading ? <Loader /> : "Save"}
//   </button>
// )}

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
  /* ============================
     STATE
  ============================ */
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

  /* ============================
     🔹 FETCH ADDRESS ON LOAD
  ============================ */
  useEffect(() => {
    api
      .get("/address")
      .then(res => {
        const data = res.data || {};

        /* ✅ NULL-SAFE NORMALIZATION */
        setForm({
          address_line1: data.address_line1 || "",
          address_line2: data.address_line2 || "",
          city: data.city || "",
          state: data.state || "",
          pincode: data.pincode || ""
        });
      })
      .catch(() => {
        setError("Failed to load address");
      });
  }, []);

  /* ============================
     HANDLE CHANGE
  ============================ */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ============================
     SAVE ADDRESS
  ============================ */
  const handleSave = async () => {
    setError("");
    setSuccess("");

    try {
      setLoading(true);
      const res = await api.put("/update-address", form);
      setSuccess(res.data.message);
      setIsEditing(false);
    } catch (err) {
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
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {!isEditing ? (
            <button
              type="button"
              className="verify-btn"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          ) : (
            <button
              type="button"
              className="verify-btn"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? <Loader /> : "Save"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default Address;
