// const express = require("express");
// const db = require("../db");
// const router = express.Router();

// /* ================================
//    🔑 GENERATE REFERRAL CODE
// ================================ */
// const generateCode = (username) =>
//   username.slice(0, 4).toUpperCase() + Math.floor(1000 + Math.random() * 9000);

// /* ================================
//    🎯 GET MY REFERRAL INFO
// ================================ */
// router.get("/referral", (req, res) => {
//   if (!req.session?.user) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   const username = req.session.user.username;

//   const sql = `
//     SELECT referral_code FROM users WHERE username = ?
//   `;

//   db.query(sql, [username], (err, rows) => {
//     if (err) return res.status(500).json({ message: "DB error" });

//     res.json({
//       referralCode: rows[0]?.referral_code
//     });
//   });
// });

// /* ================================
//    👥 REFERRAL STATS
// ================================ */
// router.get("/referral/stats", (req, res) => {
//   const username = req.session.user.username;

//   const sql = `
//     SELECT COUNT(*) AS total
//     FROM referrals
//     WHERE referrer_username = ?
//   `;

//   db.query(sql, [username], (err, rows) => {
//     if (err) return res.status(500).json({ message: "DB error" });

//     res.json({
//       totalReferrals: rows[0].total
//     });
//   });
// });

// module.exports = router;


const express = require("express");
const db = require("../db");

const router = express.Router();

/* ================================
   🔑 REFERRAL CODE FORMAT
   2 letters + random 4 digits
================================ */
const generateCode = (username) =>
  username.slice(0, 2).toUpperCase() +
  Math.floor(1000 + Math.random() * 9000);

/* ================================
   🎯 GET MY REFERRAL CODE
================================ */
router.get("/referral", (req, res) => {
  if (!req.session?.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const username = req.session.user.username;

  db.query(
    "SELECT referral_code FROM users WHERE username = ?",
    [username],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "DB error" });

      res.json({
        referralCode: rows[0]?.referral_code || ""
      });
    }
  );
});

/* ================================
   👥 TOTAL REFERRALS
================================ */
router.get("/referral/stats", (req, res) => {
  const username = req.session.user.username;

  db.query(
    "SELECT COUNT(*) AS total FROM referrals WHERE referrer_username = ?",
    [username],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "DB error" });

      res.json({
        totalReferrals: rows[0].total
      });
    }
  );
});

/* ================================
   📋 LIST REFERRED USERS
================================ */
router.get("/referral/users", (req, res) => {
  const username = req.session.user.username;

  db.query(
    "SELECT referred_username FROM referrals WHERE referrer_username = ?",
    [username],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "DB error" });

      res.json({
        users: rows.map(r => r.referred_username)
      });
    }
  );
});

module.exports = router;
