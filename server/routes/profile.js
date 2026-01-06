
// const express = require("express");
// const db = require("../db");

// const router = express.Router();

// router.get("/profile", (req, res) => {
//   if (!req.session || !req.session.user) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   const userId = req.session.user.id;

//   db.query(
//     `SELECT username, first_name, middle_name, last_name
//      FROM users_info
//      WHERE user_id = ?`,
//     [userId],
//     (err, rows) => {
//       if (err) return res.status(500).json({ message: "DB error" });
//       if (!rows.length) return res.status(404).json({ message: "User not found" });

//       res.json(rows[0]);
//     }
//   );
// });
// module.exports = router;

const express = require("express");
const db = require("../db");

const router = express.Router();

/* =========================
   GET FULL PROFILE (SESSION)
========================= */
router.get("/profile", (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = req.session.user.id;

  const sql = `
    SELECT 
      ui.username,
      ui.first_name,
      ui.middle_name,
      ui.last_name,
      um.profile_pic_url
    FROM users_info ui
    LEFT JOIN user_media um ON ui.user_id = um.user_id
    WHERE ui.user_id = ?
  `;

  db.query(sql, [userId], (err, rows) => {
    if (err) {
      console.error("❌ DB error:", err);
      return res.status(500).json({ message: "DB error" });
    }

    if (!rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(rows[0]);
  });
});

module.exports = router;
