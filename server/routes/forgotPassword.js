

require("dotenv").config();

const express = require("express");
const db = require("../db");

const {
  sendOTP,
  verifyOTP,
  deleteOTP,
  isVerified,
} = require("../services/otpService");

const {
  resetPassword,
} = require("../services/passwordService");

const router = express.Router();

/* =========================================
        SEND OTP
========================================= */

router.post("/forgot-password/send-otp", async (req, res) => {

  try {

    console.log("========== SEND OTP START ==========");

    const { email } = req.body;

    console.log("STEP 1 : Email =", email);

    if (!email) {

      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });

    }

    console.log("STEP 2 : Checking user...");

    const user = await db.query(
      `
      SELECT user_id
      FROM user_verification
      WHERE email = $1
      `,
      [email]
    );

    console.log("STEP 3 : User Query =", user.rows);

    if (user.rows.length === 0) {

      console.log("STEP 4 : Email not registered");

      return res.status(404).json({
        success: false,
        message: "Email not registered.",
      });

    }

    console.log("STEP 5 : Calling sendOTP()");

    await sendOTP(
      email,
      "forgot_password",
      "Project Coin Password Reset"
    );

    console.log("STEP 6 : OTP Sent Successfully");

    return res.json({
      success: true,
      message: "OTP sent successfully.",
    });

  } catch (err) {

    console.error("SEND OTP ERROR");
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }

});

// /* =========================================
//         VERIFY OTP
// ========================================= */

// router.post("/forgot-password/verify-otp", async (req, res) => {

//   try {

//     console.log("VERIFY OTP");

//     const {
//       email,
//       otp,
//     } = req.body;

//     const result = await verifyOTP(
//       email,
//       otp,
//       "forgot_password"
//     );

//     if (!result.success) {

//       return res.status(400).json(result);

//     }

//     return res.json({
//       success: true,
//       message: "OTP verified successfully.",
//     });

//   } catch (err) {

//     console.error(err);

//     return res.status(500).json({
//       success: false,
//       message: err.message,
//     });

//   }

// });


/* =========================================
        VERIFY OTP
========================================= */

router.post("/forgot-password/verify-otp", async (req, res) => {
  try {
    console.log("VERIFY OTP");

    const { email, otp } = req.body;

    // Verify OTP
    const result = await verifyOTP(
      email,
      otp,
      "forgot_password"
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    // Get username for this email
    const user = await db.query(
      `
      SELECT username
      FROM user_verification
      WHERE email = $1
      `,
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.json({
      success: true,
      message: "OTP verified successfully.",
      username: user.rows[0].username,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});


/* =========================================
        RESET PASSWORD
========================================= */

router.post("/forgot-password/reset-password", async (req, res) => {

  try {

    console.log("RESET PASSWORD");

    const {
      email,
      newPassword,
    } = req.body;

    if (!email || !newPassword) {

      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });

    }

    const verified = await isVerified(
      email,
      "forgot_password"
    );

    if (!verified) {

      return res.status(400).json({
        success: false,
        message: "OTP verification required.",
      });

    }

    const result = await resetPassword(
      email,
      newPassword
    );

    if (!result.success) {

      return res.status(400).json(result);

    }

    await deleteOTP(
      email,
      "forgot_password"
    );

    return res.json({
      success: true,
      message: "Password updated successfully.",
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }

});

module.exports = router;