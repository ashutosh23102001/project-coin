
const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");
const generateReferralCode = require("../utils/generateReferralCode");
const auth = require("../middleware/auth");

const router = express.Router();

/* =====================================================
   LOGIN
===================================================== */

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // ✅ Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    // ✅ Find user
    const result = await db.query(
      `
      SELECT
        id,
        username,
        password
      FROM users
      WHERE username = $1
      `,
      [username.trim()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    const user = result.rows[0];

    // ✅ Compare bcrypt password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    //   CREATE LOGIN SESSION
    // =====================================================

    req.session.user = {
      id: user.id,
      username: user.username,
    };

    req.session.save((err) => {

      if (err) {
        console.error("SESSION SAVE ERROR:", err);

        return res.status(500).json({
          success: false,
          message: "Session Error",
        });
      }

      return res.json({
        success: true,
        message: "Login successful",
        user: req.session.user,
      });

    });



  } catch (err) {
    console.error("========= Login ERROR =========");
    console.error(err);
    console.error(err.stack);

    res.status(500).json({
        success: false,
        message: err.message,
    });
}
});


/* =====================================================
   REGISTER
===================================================== */

router.post("/register", async (req, res) => {
  try {

    let { username, password, referralCode } = req.body;

    username = username?.trim();
    password = password?.trim();
    referralCode = referralCode?.trim().toUpperCase();
    // ✅ Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    if (username.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Username must be at least 3 characters",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // ✅ Username already exists?
    const existingUser = await db.query(
      `
      SELECT id
      FROM users
      WHERE username = $1
      `,
      [username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Username already exists",
      });
    }

    // ✅ Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Generate referral code
    const myReferralCode = generateReferralCode(username);

    // ✅ Insert user
    const insertedUser = await db.query(
      `
      INSERT INTO users
      (
        username,
        password,
        referral_code
      )
      VALUES
      (
        $1,
        $2,
        $3
      )
      RETURNING id, username
      `,
      [
        username,
        hashedPassword,
        myReferralCode,
      ]
    );

    const newUser = insertedUser.rows[0];

/* =====================================================
   SAVE REFERRAL
===================================================== */

// ======== CORRECTION START ========

if (referralCode) {

  const referrer = await db.query(
    `
    SELECT username
    FROM users
    WHERE referral_code=$1
    `,
    [referralCode]
  );

  if (referrer.rows.length > 0) {

    // Prevent self referral
    if (referrer.rows[0].username !== username) {

      await db.query(
        `
        INSERT INTO referrals
        (
          referrer_username,
          referred_username
        )
        VALUES
        (
          $1,
          $2
        )
        `,
        [
          referrer.rows[0].username,
          username
        ]
      );

    }

  }

}

// ======== CORRECTION END ========


    // ✅ Auto Login
    req.session.user = {
      id: newUser.id,
      username: newUser.username,
    };

    req.session.save((err) => {

      if (err) {

        console.error("SESSION SAVE ERROR:", err);

        return res.status(500).json({
          success: false,
          message: "Session error",
        });

      }

      return res.json({
        success: true,
        message: "Registered successfully",
        user: req.session.user,
      });

    });

  } catch (err) {
    console.error("========= REGISTER ERROR =========");
    console.error(err);
    console.error(err.stack);

    res.status(500).json({
        success: false,
        message: err.message,
    });
}
});


/* =====================================================
   LOGOUT
===================================================== */

router.post("/logout", (req, res) => {

  req.session.destroy((err) => {

    if (err) {
      return res.status(500).json({
        success: false,
        message: "Logout failed",
      });
    }

    res.clearCookie("dcoin.sid");

    return res.json({
      success: true,
      message: "Logged out successfully",
    });

  });

});


module.exports = router;