



// const express = require("express");
// const nodemailer = require("nodemailer");
// const db = require("../db");
// const auth = require("../middleware/auth");

// const router = express.Router();

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// /* ================= SEND OTP ================= */

// router.post("/send-email-otp", auth, async (req, res) => {

//   try {

//     const { email } = req.body;

//     const otp = Math.floor(
//       100000 + Math.random() * 900000
//     ).toString();

//     await db.query(
//       `
//       INSERT INTO email_otps
//       (email,otp,verified)

//       VALUES($1,$2,false)

//       ON CONFLICT(email)

//       DO UPDATE SET

//       otp=EXCLUDED.otp,
//       verified=false
//       `,
//       [email, otp]
//     );

//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: "Email Verification OTP",
//       text: `Your OTP is ${otp}`,
//     });

//     res.json({
//       success:true,
//       message:"OTP Sent"
//     });

//   } catch(err){

//     console.error(err);

//     res.status(500).json({
//       message:"Unable to send OTP"
//     });

//   }

// });

// module.exports=router;


require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

/* =========================
   GMAIL TRANSPORTER
========================= */

// ======== CORRECTION START ========

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true only for port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
});

// ======== CORRECTION END ========
// ======== CORRECTION START ========
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Gmail Verify Error:");
    console.error(error);
  } else {
    console.log("✅ Gmail Server Ready");
  }
});
// ======== CORRECTION END ========

/* =========================
   SEND EMAIL OTP
========================= */

router.post("/send-email-otp", auth, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // ======== CORRECTION START ========
    // Prevent another user from using an already verified email

    const existingEmail = await db.query(
      `
      SELECT user_id
      FROM user_verification
      WHERE email = $1
      AND user_id <> $2
      `,
      [email, req.session.user.id]
    );

    if (existingEmail.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email is already used by another account.",
      });
    }

    // ======== CORRECTION END ========

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = new Date(Date.now() + 60 * 1000);

    await db.query(
      `
      INSERT INTO email_otps
      (
        email,
        otp,
        verified,
        expires_at
      )
      VALUES
      (
        $1,
        $2,
        false,
        $3
      )
      ON CONFLICT (email)
      DO UPDATE SET
        otp = EXCLUDED.otp,
        verified = false,
        expires_at = EXCLUDED.expires_at
      `,
      [email, otp, expiresAt]
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Project Coin Email Verification",
      text: `Your OTP is ${otp}. It is valid for 1 minute.`,
    });

    return res.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (err) {
  console.error("========== SEND OTP ERROR ==========");
  console.error(err);
  console.error("Message:", err.message);
  console.error("Code:", err.code);
  console.error("Response:", err.response);
  console.error("Response Code:", err.responseCode);

  return res.status(500).json({
    success: false,
    message: err.message,
  });
}
});

/* =========================
   VERIFY EMAIL OTP
========================= */
router.post("/verify-email-otp", auth, async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const result = await db.query(
      `
      SELECT *
      FROM email_otps
      WHERE email = $1
      `,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    }

    const row = result.rows[0];

    if (row.verified) {
      return res.json({
        success: true,
        message: "Already verified",
      });
    }

    if (new Date() > new Date(row.expires_at)) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    if (row.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    await db.query(
      `
      UPDATE email_otps
      SET verified = true
      WHERE email = $1
      `,
      [email]
    );

    // ======== CORRECTION START ========
    // Save verified email permanently

    await db.query(
      `
      INSERT INTO user_verification
      (
        user_id,
        email
      )
      VALUES
      (
        $1,
        $2
      )
      ON CONFLICT (user_id)
      DO UPDATE SET
        email = EXCLUDED.email,
        updated_at = CURRENT_TIMESTAMP
      `,
      [
        req.session.user.id,
        email,
      ]
    );

    // Delete OTP after successful verification

    await db.query(
      `
      DELETE FROM email_otps
      WHERE email = $1
      `,
      [email]
    );

    // ======== CORRECTION END ========

    return res.json({
      success: true,
      message: "Email verified successfully",
    });

  } catch (err) {

    console.error("VERIFY OTP ERROR");
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
});

/* =========================
   GET VERIFIED EMAIL
========================= */

// ======== CORRECTION START ========

router.get("/get-email", auth, async (req, res) => {

  try {

    const result = await db.query(
      `
      SELECT email
      FROM user_verification
      WHERE user_id = $1
      `,
      [req.session.user.id]
    );

    return res.json({
      success: true,
      email: result.rows[0]?.email || "",
    });

  } catch (err) {

    console.error("GET EMAIL ERROR");
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }

});

// ======== CORRECTION END ========

module.exports = router;