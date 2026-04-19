

// const express = require("express");
// const db = require("../db");

// const router = express.Router();



// /* =====================================================
//    🔹 GET ADDRESS (FETCH USING SESSION USER ID)
// ===================================================== */
// router.get("/address", (req, res) => {
//   if (!req.session || !req.session.user) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   const userId = req.session.user.id; // ✅ SESSION USER ID

//   const sql = `
//     SELECT 
//       address_line1,
//       address_line2,
//       city,
//       state,
//       pincode
//     FROM user_contacts
//     WHERE user_id = ?
//   `;

//   db.query(sql, [userId], (err, rows) => {
//     if (err) {
//       console.error("❌ DB Error (fetch-address):", err);
//       return res.status(500).json({ message: "Database error" });
//     }

//     if (!rows.length) {
//       return res.json({
//         address_line1: "",
//         address_line2: "",
//         city: "",
//         state: "",
//         pincode: ""
//       });
//     }

//     res.json(rows[0]); // ✅ SEND EXISTING DATA
//   });
// });


// /* ============================
//    UPDATE ADDRESS DETAILS
// ============================ */
// router.put("/update-address", (req, res) => {
//   /* ❌ FIX: session check was OK but keep strict */
//   if (!req.session || !req.session.user) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   /* ✅ CORRECT: use user_id instead of username (safer & indexed) */
//   const userId = req.session.user.id;

//   /* ============================
//      📥 DATA FROM FRONTEND
//   ============================ */
//   const {
//     address_line1,   // ✅ ADDED
//     address_line2,   // ✅ ADDED (nullable)
//     city,            // ✅ ADDED
//     state,           // ✅ ADDED
//     pincode          // ✅ ADDED
//   } = req.body;

//   /* ============================
//      🛠 VALIDATION
//   ============================ */
//   if (!address_line1 || !city || !state || !pincode) {
//     return res.status(400).json({
//       message: "Address Line 1, City, State and Pincode are required"
//     });
//   }

//   /* ============================
//      🧠 SQL QUERY
//   ============================ */
//   const sql = `
//     UPDATE user_contacts SET
//       address_line1 = ?,        -- ✅ ADDED
//       address_line2 = ?,        -- ✅ ADDED
//       city = ?,                 -- ✅ ADDED
//       state = ?,                -- ✅ ADDED
//       pincode = ?,              -- ✅ ADDED
//       updated_at = NOW()
//     WHERE user_id = ?
//   `;

//   /* ============================
//      🚀 EXECUTION
//   ============================ */
//   db.query(
//     sql,
//     [
//       address_line1,
//       address_line2 || null,   // ✅ NULL SAFE
//       city,
//       state,
//       pincode,
//       userId                   // ✅ CORRECT WHERE CONDITION
//     ],
//     (err, result) => {
//       if (err) {
//         console.error("❌ DB Error (update-address):", err);
//         return res.status(500).json({ message: "Database error" });
//       }

//       /* ❌ FIX: handle no rows updated */
//       if (result.affectedRows === 0) {
//         return res.status(404).json({ message: "User not found" });
//       }

//       /* ✅ SUCCESS */
//       res.json({
//         message: "Address details updated successfully"
//       });
//     }
//   );
// });

// module.exports = router;

const express = require("express");
const db = require("../db");

const router = express.Router();

/* ================= GET ADDRESS ================= */
router.get("/address", (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = req.session.user.id;

  const sql = `
    SELECT address_line1, address_line2, city, state, pincode
    FROM user_contacts
    WHERE user_id = ?
  `;

  db.query(sql, [userId], (err, rows) => {
    if (err) {
      console.error("❌ GET ERROR:", err);   // 🔴 DEBUG
      return res.status(500).json({ message: "Database error" });
    }

    if (!rows.length) {
      return res.json({
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        pincode: ""
      });
    }

    res.json(rows[0]);
  });
});

/* ================= SAVE ADDRESS ================= */
router.put("/address", (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = req.session.user.id;

  const {
    address_line1,
    address_line2,
    city,
    state,
    pincode
  } = req.body;

  if (!address_line1 || !city || !state || !pincode) {
    return res.status(400).json({
      message: "All required fields missing"
    });
  }

  /* 🔴 FIX: SIMPLE LOG TO DEBUG */
  console.log("DATA:", req.body);
  console.log("USER:", userId);

  /* 🔴 FIX: FIRST CHECK IF ROW EXISTS */
  const checkSql = `SELECT user_id FROM user_contacts WHERE user_id = ?`;

  db.query(checkSql, [userId], (err, rows) => {
    if (err) {
      console.error("❌ CHECK ERROR:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (rows.length === 0) {
      /* 🔴 INSERT */
      const insertSql = `
        INSERT INTO user_contacts
        (user_id, address_line1, address_line2, city, state, pincode)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      db.query(
        insertSql,
        [
          userId,
          address_line1,
          address_line2 || null,
          city,
          state,
          pincode
        ],
        (err) => {
          if (err) {
            console.error("❌ INSERT ERROR:", err); // 🔴 SEE THIS IN RENDER LOG
            return res.status(500).json({ message: "Database error" });
          }

          return res.json({ message: "Address saved successfully" });
        }
      );
    } else {
      /* 🔴 UPDATE */
      const updateSql = `
        UPDATE user_contacts SET
          address_line1 = ?,
          address_line2 = ?,
          city = ?,
          state = ?,
          pincode = ?,
          updated_at = NOW()
        WHERE user_id = ?
      `;

      db.query(
        updateSql,
        [
          address_line1,
          address_line2 || null,
          city,
          state,
          pincode,
          userId
        ],
        (err) => {
          if (err) {
            console.error("❌ UPDATE ERROR:", err);
            return res.status(500).json({ message: "Database error" });
          }

          res.json({ message: "Address updated successfully" });
        }
      );
    }
  });
});

module.exports = router;