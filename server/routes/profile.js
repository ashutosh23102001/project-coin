
const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/profile", (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = req.session.user.id;

  db.query(
    `SELECT username, first_name, middle_name, last_name
     FROM users_info
     WHERE user_id = ?`,
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "DB error" });
      if (!rows.length) return res.status(404).json({ message: "User not found" });

      res.json(rows[0]);
    }
  );
});
module.exports = router;
