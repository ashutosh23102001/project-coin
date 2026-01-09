

const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");

const router = express.Router();

/* ======================
   LOGIN
====================== */
router.post("/login", async (req, res) => {
  const { Username, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE username=?",
    [Username],
    async (err, rows) => {
      if (err) return res.status(500).json({ message: "DB error" });

      if (!rows.length)
        return res.status(401).json({ message: "Invalid login" });

      const ok = await bcrypt.compare(password, rows[0].password);
      if (!ok)
        return res.status(401).json({ message: "Invalid login" });

      // ✅ SESSION SET
      req.session.user = {
        id: rows[0].id,          // 🔴 users.id
        username: rows[0].username
      };

      // 🔴 🔴 🔴 MAIN FIX
      // ENSURE users_info ROW EXISTS
      db.query(
        "SELECT user_id FROM users_info WHERE user_id=?",
        [rows[0].id],
        (err, infoRows) => {
          if (!infoRows.length) {
            db.query(
              "INSERT INTO users_info (user_id, username) VALUES (?, ?)",
              [rows[0].id, rows[0].username]
            );
          }
        }
      );

      res.json({
        message: "Login successful",
        user: req.session.user
      });
    }
  );
});

// /* ================= LOGOUT ================= */
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("dcoin.sid");
    res.json({ message: "Logged out successfully" });
  });
});


router.post("/register", async (req, res) => {
  const { Username, Password } = req.body;

  if (!Username || !Password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (Password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  db.query(
    "SELECT id FROM users WHERE username=?",
    [Username],
    async (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length > 0) {
        return res
          .status(409)
          .json({ message: "Username already exists" });
      }

      const hashedPassword = await bcrypt.hash(Password, 10);

      db.query(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        [Username, hashedPassword],
        (err) => {
          if (err) return res.status(500).json(err);
          res.json({ message: "User registered successfully" });
        }
      );
    }
  );
});

module.exports = router;
