// const express = require("express");
// const router = express.Router();
// const db = require("../db");

// // GET profile
// router.get("/", (req, res) => {
//   if (!req.session.user) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   const sql = "SELECT id, username, email FROM users WHERE id=?";
//   db.query(sql, [req.session.user.id], (err, data) => {
//     if (err) return res.status(500).json(err);
//     res.json(data[0]);
//   });
// });

// // UPDATE profile
// router.put("/", (req, res) => {
//   if (!req.session.user) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   const { username, email } = req.body;
//   const userId = req.session.user.id;

//   const checkSql = "SELECT id FROM users WHERE username=? AND id!=?";
//   db.query(checkSql, [username, userId], (err, result) => {
//     if (result.length > 0) {
//       return res.status(409).json({ message: "Username already taken" });
//     }

//     const updateSql = "UPDATE users SET username=?, email=? WHERE id=?";
//     db.query(updateSql, [username, email, userId], (err) => {
//       if (err) return res.status(500).json(err);

//       req.session.user.username = username;
//       res.json({ message: "Profile updated" });
//     });
//   });
// });

// module.exports = router;


// part 2

const express = require("express");
const router = express.Router();
const db = require("../db");

// =======================
// GET PROFILE
// =======================
router.get("/", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const sql = "SELECT id, username, email FROM users WHERE id=?";
  db.query(sql, [req.session.user.id], (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data[0]);
  });
});

// =======================
// UPDATE PROFILE
// =======================
router.put("/", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { username, email } = req.body;
  const userId = req.session.user.id;

  // 🔴 CHECK UNIQUE USERNAME
  const checkSql = "SELECT id FROM users WHERE username=? AND id!=?";
  db.query(checkSql, [username, userId], (err, result) => {
    if (result.length > 0) {
      return res.status(409).json({ message: "Username already taken" });
    }

    const updateSql = "UPDATE users SET username=?, email=? WHERE id=?";
    db.query(updateSql, [username, email, userId], (err) => {
      if (err) return res.status(500).json(err);

      // 🔴 UPDATE SESSION USERNAME
      req.session.user.username = username;

      res.json({ message: "Profile updated successfully" });
    });
  });
});

module.exports = router;
