
// const express = require("express");
// const db = require("../db");

// const router = express.Router();

// /* AUTH */
// const checkAuth = (req, res, next) => {
//   if (!req.session?.user) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }
//   next();
// };

// /* GET CODE */
// router.get("/referral", checkAuth, (req, res) => {
//   console.log("SESSION:", req.session);

//   const username = req.session.user.username;

//   db.query(
//     "SELECT referral_code FROM users WHERE username = ?",
//     [username],
//     (err, rows) => {
//       if (err) return res.status(500).json({ message: "DB error" });

//       console.log("DB RESULT:", rows);

//       res.json({
//         referralCode: rows[0]?.referral_code || "no input",
//       });
//     }
//   );
// });

// /* STATS */
// router.get("/referral/stats", checkAuth, (req, res) => {
//   const username = req.session.user.username;

//   db.query(
//     "SELECT COUNT(*) AS total FROM referrals WHERE referrer_username = ?",
//     [username],
//     (err, rows) => {
//       if (err) return res.status(500).json({ message: "DB error" });

//       res.json({
//         totalReferrals: rows[0]?.total || 0,
//       });
//     }
//   );
// });

// /* USERS */
// router.get("/referral/users", checkAuth, (req, res) => {
//   const username = req.session.user.username;

//   db.query(
//     "SELECT referred_username FROM referrals WHERE referrer_username = ?",
//     [username],
//     (err, rows) => {
//       if (err) return res.status(500).json({ message: "DB error" });

//       res.json({
//         users: rows.map((r) => r.referred_username),
//       });
//     }
//   );
// });

// module.exports = router;

const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

/* ================= CODE ================= */

router.get("/referral", auth, async (req, res) => {
  try {
    const result = await db.query(
      `
      SELECT referral_code
      FROM users
      WHERE username=$1
      `,
      [req.session.user.username]
    );

    res.json({
      referralCode:
        result.rows[0]?.referral_code || "",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Database Error",
    });
  }
});

/* ================= STATS ================= */

router.get("/referral/stats", auth, async (req, res) => {
  try {
    const result = await db.query(
      `
      SELECT COUNT(*)::int AS total
      FROM referrals
      WHERE referrer_username=$1
      `,
      [req.session.user.username]
    );

    res.json({
      totalReferrals:
        result.rows[0].total,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Database Error",
    });
  }
});

/* ================= USERS ================= */

router.get("/referral/users", auth, async (req, res) => {
  try {
    const result = await db.query(
      `
      SELECT referred_username
      FROM referrals
      WHERE referrer_username=$1
      `,
      [req.session.user.username]
    );

    res.json({
      users: result.rows.map(
        (row) => row.referred_username
      ),
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Database Error",
    });
  }
});

module.exports = router;