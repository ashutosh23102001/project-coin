

const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db"); // ✅ FIX: correct DB import

const router = express.Router();

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log("BODY:", req.body);

    if (!username || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    /* ✅ FIX: promise query */
    const [rows] = await db.promise().query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (!rows.length) {
      return res.status(401).json({ message: "Invalid login" });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid login" });
    }

    /* ✅ FIX: session */
    req.session.user = {
      id: user.id,
      username: user.username,
    };

    res.json({
      success: true,
      user: req.session.user,
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);

    res.status(500).json({
      message: "Server error",
    });
  }
});

/* ================= LOGOUT ================= */
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("dcoin.sid");
    res.json({ message: "Logged out" });
  });
});

module.exports = router;








/* GENERATE CODE */
function generateCode(username) {
  return (
    username.slice(0, 3).toUpperCase() +
    Math.random().toString(36).substring(2, 6).toUpperCase()
  );
}

/* REGISTER */
router.post("/register", async (req, res) => {
  try {
    const { username, password, referralCode } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const myReferralCode = generateCode(username);

    db.query(
      "INSERT INTO users (username, password, referral_code) VALUES (?, ?, ?)",
      [username, hashedPassword, myReferralCode],
      (err) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ success: false });
          }
          return res.status(500).json({ success: false });
        }

        // referral logic
        if (referralCode) {
          db.query(
            "SELECT username FROM users WHERE referral_code = ?",
            [referralCode],
            (err, rows) => {
              if (!err && rows.length) {
                const referrer = rows[0].username;

                db.query(
                  "INSERT INTO referrals (referrer_username, referred_username) VALUES (?, ?)",
                  [referrer, username]
                );

                db.query(
                  "INSERT INTO click_counter (username, clicks_added) VALUES (?, 20)",
                  [referrer]
                );
              }
            }
          );
        }

        res.json({
          success: true,
          message: "Registered successfully",
        });
      }
    );
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;