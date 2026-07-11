



// const express = require("express");
// const db = require("../db");
// const nodemailer = require("nodemailer");
// const cron = require("node-cron");

// const router = express.Router();

// /* ================= FETCH EMAIL ================= */
// router.get("/get-email", (req, res) => {
//   if (!req.session?.user) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   db.query(
//     "SELECT email FROM users_info WHERE user_id=?",
//     [req.session.user.id],
//     (err, rows) => {
//       if (err) {
//         console.error("❌ GET EMAIL ERROR:", err); // 🔴 DEBUG
//         return res.status(500).json({ message: "DB error" });
//       }

//       res.json({ email: rows[0]?.email || "" });
//     }
//   );
// });

// /* ================= OTP GENERATOR ================= */
// const generateOtp = () =>
//   Math.floor(100000 + Math.random() * 900000).toString();

// /* ================= MAIL TRANSPORT ================= */
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,   // 🔴 ENV REQUIRED
//     pass: process.env.EMAIL_PASS    // 🔴 APP PASSWORD
//   }
// });

// /* ================= SEND OTP ================= */
// router.post("/send-email-otp", (req, res) => {
//   const { email } = req.body;

//   if (!email) {
//     return res.status(400).json({ message: "Email required" });
//   }

//   const checkSql = `
//     SELECT id FROM email_otps
//     WHERE email=? AND verified=0 AND expires_at > NOW()
//     LIMIT 1
//   `;

//   db.query(checkSql, [email], (err, rows) => {
//     if (err) {
//       console.error("❌ CHECK OTP ERROR:", err);
//       return res.status(500).json({ message: "DB error" });
//     }

//     if (rows.length) {
//       return res.status(429).json({
//         message: "OTP already sent. Please wait."
//       });
//     }

//     const otp = generateOtp();
//     const expiresAt = new Date(Date.now() + 60 * 1000);

//     const insertSql = `
//       INSERT INTO email_otps (email, otp, expires_at, verified)
//       VALUES (?, ?, ?, 0)
//     `;

//     db.query(insertSql, [email, otp, expiresAt], async (err2) => {
//       if (err2) {
//         console.error("❌ INSERT OTP ERROR:", err2);
//         return res.status(500).json({ message: "DB error" });
//       }

//       try {
//         await transporter.sendMail({
//           from: process.env.EMAIL_USER,
//           to: email,
//           subject: "Email OTP",
//           html: `<h2>Your OTP: ${otp}</h2><p>Valid for 1 minute</p>`
//         });

//         res.json({ message: "OTP sent" });

//       } catch (mailErr) {
//         console.error("❌ MAIL ERROR:", mailErr); // 🔴 IMPORTANT
//         res.status(500).json({ message: "Failed to send OTP" });
//       }
//     });
//   });
// });

// router.post("/verify-email-otp", (req, res) => {
//   const { email, otp } = req.body;

//   if (!email || !otp) {
//     return res.status(400).json({ message: "Email & OTP required" });
//   }

//   if (!req.session?.user) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   const userId = req.session.user.id;

//   // 🔴 FIX: remove otp from query (fetch latest first)
//   const sql = `
//     SELECT * FROM email_otps
//     WHERE email=? AND verified=0
//     ORDER BY created_at DESC
//     LIMIT 1
//   `;

//   db.query(sql, [email], (err, rows) => {
//     if (err) {
//       console.error("❌ VERIFY ERROR:", err);
//       return res.status(500).json({ message: "DB error" });
//     }

//     if (!rows.length) {
//       return res.status(400).json({ message: "No OTP found" });
//     }

//     const record = rows[0];

//     // 🔴 FIX: compare manually
//     if (record.otp !== otp) {
//       return res.status(400).json({ message: "Invalid OTP" });
//     }

//     // 🔴 FIX: expiry check
//     if (new Date(record.expires_at) < new Date()) {
//       return res.status(400).json({ message: "OTP expired" });
//     }

//     // mark verified
//     db.query("UPDATE email_otps SET verified=1 WHERE id=?", [record.id]);

//     // save email
//     db.query(
//       "UPDATE user_contacts SET email=? WHERE user_id=?",
//       [email, userId],
//       (err2) => {
//         if (err2) {
//           console.error("❌ SAVE EMAIL ERROR:", err2);
//           return res.status(500).json({ message: "Failed to save email" });
//         }

//         res.json({ message: "Email verified successfully" });
//       }
//     );
//   });
// });




// /* ================= AUTO CLEAN ================= */
// cron.schedule("* * * * *", () => {
//   db.query("DELETE FROM email_otps WHERE expires_at < NOW()");
// });

// module.exports = router;

const express = require("express");
const nodemailer = require("nodemailer");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ================= SEND OTP ================= */

router.post("/send-email-otp", auth, async (req, res) => {

  try {

    const { email } = req.body;

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    await db.query(
      `
      INSERT INTO email_otps
      (email,otp,verified)

      VALUES($1,$2,false)

      ON CONFLICT(email)

      DO UPDATE SET

      otp=EXCLUDED.otp,
      verified=false
      `,
      [email, otp]
    );

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification OTP",
      text: `Your OTP is ${otp}`,
    });

    res.json({
      success:true,
      message:"OTP Sent"
    });

  } catch(err){

    console.error(err);

    res.status(500).json({
      message:"Unable to send OTP"
    });

  }

});

module.exports=router;