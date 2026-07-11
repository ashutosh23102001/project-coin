

// const express = require("express");
// const db = require("../db");

// const router = express.Router();

// /* =============================
//    GET PERSONAL DETAILS
// ============================= */
// router.get("/", (req, res) => {
//   if (!req.session?.user) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   const userId = req.session.user.id;

//   db.query(
//     `SELECT 
//       username,
//       first_name,
//       middle_name,
//       last_name,
//       DATE_FORMAT(date_of_birth,'%Y-%m-%d') AS date_of_birth,
//       gender
//      FROM users_info
//      WHERE user_id=?`,
//     [userId],
//     (err, rows) => {
//       if (err) {
//         console.error("GET ERROR:", err);
//         return res.status(500).json({ message: "DB error" });
//       }

//       res.json(rows[0] || {});
//     }
//   );
// });

// /* =============================
//    UPDATE / INSERT PERSONAL DETAILS
// ============================= */
// router.put("/", (req, res) => {
//   if (!req.session?.user) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   const userId = req.session.user.id;
//   const username = req.session.user.username; // ✅ FIX ADDED

//   let {
//     first_name = "",
//     middle_name = "",
//     last_name = "",
//     date_of_birth = null,
//     gender = ""
//   } = req.body;

//   // ✅ Validate date
//   if (!date_of_birth || !/^\d{4}-\d{2}-\d{2}$/.test(date_of_birth)) {
//     date_of_birth = null;
//   }

//   /* =============================
//      UPSERT (INSERT + UPDATE)
//   ============================= */
//   db.query(
//     `INSERT INTO users_info 
//     (user_id, username, first_name, middle_name, last_name, date_of_birth, gender)
//     VALUES (?, ?, ?, ?, ?, ?, ?)
//     ON DUPLICATE KEY UPDATE
//       first_name = VALUES(first_name),
//       middle_name = VALUES(middle_name),
//       last_name = VALUES(last_name),
//       date_of_birth = VALUES(date_of_birth),
//       gender = VALUES(gender),
//       updated_at = NOW()`,
//     [
//       userId,
//       username, // ✅ FIXED (this was missing)
//       first_name,
//       middle_name,
//       last_name,
//       date_of_birth,
//       gender
//     ],
//     (err) => {
//       if (err) {
//         console.error("UPSERT ERROR:", err);
//         return res.status(500).json({ message: err.message });
//       }

//       res.json({ message: "Saved successfully" });
//     }
//   );
// });

// module.exports = router;

const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

/* ================= GET PERSONAL ================= */

router.get("/", auth, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT
        username,
        first_name,
        middle_name,
        last_name,
        date_of_birth,
        gender
      FROM users_info
      WHERE user_id = $1`,
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

/* ================= SAVE PERSONAL ================= */

router.put("/", auth, async (req, res) => {
  try {
    const {
      first_name,
      middle_name,
      last_name,
      date_of_birth,
      gender,
    } = req.body;

    await db.query(
      `
      INSERT INTO users_info
      (
        user_id,
        username,
        first_name,
        middle_name,
        last_name,
        date_of_birth,
        gender
      )
      VALUES
      (
        $1,$2,$3,$4,$5,$6,$7
      )

      ON CONFLICT (user_id)

      DO UPDATE SET

      first_name=EXCLUDED.first_name,
      middle_name=EXCLUDED.middle_name,
      last_name=EXCLUDED.last_name,
      date_of_birth=EXCLUDED.date_of_birth,
      gender=EXCLUDED.gender,
      updated_at=NOW()
      `,
      [
        req.session.user.id,
        req.session.user.username,
        first_name,
        middle_name,
        last_name,
        date_of_birth || null,
        gender,
      ]
    );

    res.json({
      success: true,
      message: "Saved Successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Database Error",
    });
  }
});

module.exports = router;