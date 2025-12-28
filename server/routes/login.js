
const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");

const router = express.Router();

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
  const { Username, Email, Password } = req.body;

  if (!Username || !Email || !Password) {
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
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        [Username, Email, hashedPassword],
        (err) => {
          if (err) return res.status(500).json(err);
          res.json({ message: "User registered successfully" });
        }
      );
    }
  );
});

/* ================= LOGIN ================= */
router.post("/login", (req, res) => {
  const { Username, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE username=?",
    [Username],
    async (err, rows) => {
      if (err) return res.status(500).json(err);

      if (!rows.length) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const user = rows[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // ✅ FIXED SESSION STORAGE
      req.session.user = {
        id: user.id,
        username: user.username,
        email: user.email
      };

      res.json({
        message: "Login success",
        user: req.session.user
      });
    }
  );
});

/* ================= LOGOUT ================= */
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("dcoin.sid");
    res.json({ message: "Logged out successfully" });
  });
});

module.exports = router;
