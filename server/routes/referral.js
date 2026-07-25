

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