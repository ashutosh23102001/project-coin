const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");

const router = express.Router();

/* REGISTER */
router.post("/register", async (req, res) => {
  const { Username, Email, Password } = req.body;

  const [exists] = await db.query(
    "SELECT id FROM users WHERE username=?",
    [Username]
  );

  if (exists.length)
    return res.status(409).json({ message: "Username already exists" });

  const hashed = await bcrypt.hash(Password, 10);

  await db.query(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [Username, Email, hashed]
  );

  res.json({ message: "Registered successfully" });
});

/* LOGIN */
router.post("/login", async (req, res) => {
  const { Username, password } = req.body;

  const [rows] = await db.query(
    "SELECT * FROM users WHERE username=?",
    [Username]
  );

  if (!rows.length)
    return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, rows[0].password);
  if (!ok)
    return res.status(401).json({ message: "Invalid credentials" });

  req.session.user = {
    id: rows[0].id,
    username: rows[0].username,
    email: rows[0].email
  };

  res.json({ message: "Login successful", user: req.session.user });
});

/* LOGOUT */
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("dcoin.sid");
    res.json({ message: "Logged out" });
  });
});

/* AUTH CHECK */
router.get("/auth/me", (req, res) => {
  res.json({
    loggedIn: !!req.session.user,
    user: req.session.user || null
  });
});

module.exports = router;
