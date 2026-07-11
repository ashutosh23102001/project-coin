
// const express = require("express");
// const db = require("../db");

// const router = express.Router();

// /* =========================
//    GET FULL PROFILE (SESSION)
// ========================= */
// router.get("/profile", (req, res) => {
//   if (!req.session || !req.session.user) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   const userId = req.session.user.id;

//   const sql = `
//     SELECT 
//       ui.username,
//       ui.first_name,
//       ui.middle_name,
//       ui.last_name,
//       um.profile_pic_url,
//       um.cover_pic_url

//     FROM users_info ui
//     LEFT JOIN user_media um ON ui.user_id = um.user_id
//     WHERE ui.user_id = ?
//   `;

//   db.query(sql, [userId], (err, rows) => {
//     if (err) {
//       console.error("❌ DB error:", err);
//       return res.status(500).json({ message: "DB error" });
//     }

//     if (!rows.length) {
//       return res.status(404).json({ message: "User not found only message" });
//     }

//     res.json(rows[0]);
//   });
// });

// module.exports = router;

const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/profile", auth, async (req, res) => {
  try {
    const result = await db.query(
      `
      SELECT

      ui.username,
      ui.first_name,
      ui.middle_name,
      ui.last_name,

      um.profile_pic_url,
      um.cover_pic_url

      FROM users_info ui

      LEFT JOIN user_media um
      ON ui.user_id = um.user_id

      WHERE ui.user_id=$1
      `,
      [req.session.user.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Database Error",
    });
  }
});

module.exports = router;