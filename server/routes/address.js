
// const express = require("express");
// const db = require("../db");

// const router = express.Router();

// /* ================= GET ADDRESS ================= */
// router.get("/address", (req, res) => {
//   if (!req.session || !req.session.user) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   const userId = req.session.user.id;

//   const sql = `
//     SELECT address_line1, address_line2, city, state, pincode
//     FROM user_contacts
//     WHERE user_id = ?
//   `;

//   db.query(sql, [userId], (err, rows) => {
//     if (err) {
//       console.error("❌ GET ERROR:", err);   // 🔴 DEBUG
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

//     res.json(rows[0]);
//   });
// });

// /* ================= SAVE ADDRESS ================= */
// router.put("/address", (req, res) => {
//   if (!req.session || !req.session.user) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   const userId = req.session.user.id;

//   const {
//     address_line1,
//     address_line2,
//     city,
//     state,
//     pincode
//   } = req.body;

//   if (!address_line1 || !city || !state || !pincode) {
//     return res.status(400).json({
//       message: "All required fields missing"
//     });
//   }

//   /* 🔴 FIX: SIMPLE LOG TO DEBUG */
//   console.log("DATA:", req.body);
//   console.log("USER:", userId);

//   /* 🔴 FIX: FIRST CHECK IF ROW EXISTS */
//   const checkSql = `SELECT user_id FROM user_contacts WHERE user_id = ?`;

//   db.query(checkSql, [userId], (err, rows) => {
//     if (err) {
//       console.error("❌ CHECK ERROR:", err);
//       return res.status(500).json({ message: "Database error" });
//     }

//     if (rows.length === 0) {
//       /* 🔴 INSERT */
//       const insertSql = `
//         INSERT INTO user_contacts
//         (user_id, address_line1, address_line2, city, state, pincode)
//         VALUES (?, ?, ?, ?, ?, ?)
//       `;

//       db.query(
//         insertSql,
//         [
//           userId,
//           address_line1,
//           address_line2 || null,
//           city,
//           state,
//           pincode
//         ],
//         (err) => {
//           if (err) {
//             console.error("❌ INSERT ERROR:", err); // 🔴 SEE THIS IN RENDER LOG
//             return res.status(500).json({ message: "Database error" });
//           }

//           return res.json({ message: "Address saved successfully" });
//         }
//       );
//     } else {
//       /* 🔴 UPDATE */
//       const updateSql = `
//         UPDATE user_contacts SET
//           address_line1 = ?,
//           address_line2 = ?,
//           city = ?,
//           state = ?,
//           pincode = ?,
//           updated_at = NOW()
//         WHERE user_id = ?
//       `;

//       db.query(
//         updateSql,
//         [
//           address_line1,
//           address_line2 || null,
//           city,
//           state,
//           pincode,
//           userId
//         ],
//         (err) => {
//           if (err) {
//             console.error("❌ UPDATE ERROR:", err);
//             return res.status(500).json({ message: "Database error" });
//           }

//           res.json({ message: "Address updated successfully" });
//         }
//       );
//     }
//   });
// });

// module.exports = router;

const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

/* ================= GET ADDRESS ================= */

router.get("/address", auth, async (req, res) => {
  try {

    const result = await db.query(
      `
      SELECT
        address_line1,
        address_line2,
        city,
        state,
        pincode
      FROM user_contacts
      WHERE user_id=$1
      `,
      [req.session.user.id]
    );

    res.json(result.rows[0] || {});

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Database Error",
    });

  }
});

/* ================= SAVE ADDRESS ================= */

router.put("/address", auth, async (req, res) => {

  try {

    const {
      address_line1,
      address_line2,
      city,
      state,
      pincode
    } = req.body;

    await db.query(
      `
      INSERT INTO user_contacts
      (
        user_id,
        address_line1,
        address_line2,
        city,
        state,
        pincode
      )

      VALUES
      (
        $1,$2,$3,$4,$5,$6
      )

      ON CONFLICT (user_id)

      DO UPDATE SET

      address_line1=EXCLUDED.address_line1,
      address_line2=EXCLUDED.address_line2,
      city=EXCLUDED.city,
      state=EXCLUDED.state,
      pincode=EXCLUDED.pincode,
      updated_at=NOW()
      `,
      [
        req.session.user.id,
        address_line1,
        address_line2,
        city,
        state,
        pincode
      ]
    );

    res.json({
      success:true,
      message:"Address Saved"
    });

  } catch(err){

    console.error(err);

    res.status(500).json({
      message:"Database Error"
    });

  }

});

module.exports=router;