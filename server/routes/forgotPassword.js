const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");

const router = express.Router();

/* ========= GET EMAIL BY USERNAME ========= */
router.post("/forgot-password/get-email", (req, res) => {
  const { username } = req.body;

  db.query(
    `SELECT ui.email
     FROM users u
     JOIN users_info ui ON u.id = ui.user_id
     WHERE u.username = ?`,
    [username],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "DB error" });
      if (!rows.length || !rows[0].email)
        return res.status(404).json({ message: "Email not found" });

      res.json({ email: rows[0].email });
    }
  );
});

/* ========= VERIFY OTP (NO SESSION) ========= */
router.post("/forgot-password/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  db.query(
    `SELECT * FROM email_otps
     WHERE email=? AND otp=? AND verified=0
     ORDER BY created_at DESC LIMIT 1`,
    [email, otp],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "DB error" });
      if (!rows.length)
        return res.status(400).json({ message: "Invalid OTP" });

      if (new Date(rows[0].expires_at) < new Date())
        return res.status(400).json({ message: "OTP expired" });

      db.query(
        "UPDATE email_otps SET verified=1 WHERE id=?",
        [rows[0].id]
      );

      res.json({ message: "OTP verified" });
    }
  );
});

/* ========= RESET PASSWORD ========= */
router.post("/forgot-password/reset", async (req, res) => {
  const { username, newPassword } = req.body;

  const hashed = await bcrypt.hash(newPassword, 10);

  db.query(
    "UPDATE users SET password=? WHERE username=?",
    [hashed, username],
    err => {
      if (err)
        return res.status(500).json({ message: "Update failed" });

      res.json({ message: "Password updated successfully" });
    }
  );
});

module.exports = router;
