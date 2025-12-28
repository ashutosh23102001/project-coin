

const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");

const router = express.Router();

/* ===== GET ACCOUNT ===== */
router.get("/", (req, res) => {
  if (!req.session.user)
    return res.status(401).json({ message: "Unauthorized" });

  db.query(
    "SELECT id, username FROM users WHERE id=?",
    [req.session.user.id],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows[0]);
    }
  );
});

/* ===== UPDATE PASSWORD ===== */
router.put("/", async (req, res) => {
  if (!req.session.user)
    return res.status(401).json({ message: "Unauthorized" });

  const { oldPassword, newPassword } = req.body;
  const userId = req.session.user.id;

  db.query(
    "SELECT * FROM users WHERE id=?",
    [userId],
    async (err, rows) => {
      if (err) return res.status(500).json(err);

      const user = rows[0];
      const match = await bcrypt.compare(oldPassword, user.password);

      if (!match)
        return res.status(400).json({ message: "Old password incorrect" });

      const hashed = newPassword
        ? await bcrypt.hash(newPassword, 10)
        : user.password;

      db.query(
        "UPDATE users SET password=? WHERE id=?",
        [hashed, userId],
        () => res.json({ message: "Password updated successfully" })
      );
    }
  );
});

/* ===== UPDATE USERNAME ===== */
router.put("/username", (req, res) => {
  if (!req.session.user)
    return res.status(401).json({ message: "Unauthorized" });

  const { username } = req.body;
  const userId = req.session.user.id;

  db.query(
    "UPDATE users SET username=? WHERE id=?",
    [username, userId],
    () => {
      req.session.user.username = username;
      res.json({ message: "Username updated", username });
    }
  );
});

module.exports = router;
