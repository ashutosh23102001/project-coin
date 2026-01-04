const express = require("express");
const db = require("../db");
const nodemailer = require("nodemailer");


console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "LOADED" : "MISSING");


const router = express.Router();

/* ================= OTP GENERATOR ================= */
const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

/* ================= EMAIL TRANSPORT ================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // 🔴 FIX: dotenv loaded FIRST
    pass: process.env.EMAIL_PASS
  }
});

/* ================= SEND EMAIL OTP ================= */
router.post("/send-email-otp", (req, res) => {
      console.log("SEND OTP HIT", req.body); // 👈 ADD THIS

  const { email } = req.body;

  if (!email)
    return res.status(400).json({ message: "Email required" });

  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  // 🔴 FIX: callback-based MySQL (NO await)
  db.query(
    "INSERT INTO email_otps (email, otp, expires_at) VALUES (?, ?, ?)",
    [email, otp, expiresAt],
    async (err) => {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      try {
        await transporter.sendMail({
          from: `"OTP Verification" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "Your Email Verification OTP",
          html: `
            <h2>Email Verification</h2>
            <h1>${otp}</h1>
            <p>Valid for 5 minutes</p>
          `
        });

        res.json({ message: "OTP sent successfully" });
      } catch (mailErr) {
        console.error("Mail Error:", mailErr);
        res.status(500).json({ message: "Email sending failed" });
      }
    }
  );
});

/* ================= VERIFY EMAIL OTP ================= */
router.post("/verify-email-otp", (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp)
    return res.status(400).json({ message: "Email & OTP required" });

  db.query(
    `SELECT * FROM email_otps
     WHERE email=? AND otp=? AND verified=FALSE
     ORDER BY created_at DESC LIMIT 1`,
    [email, otp],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error" });
      }

      if (!rows.length)
        return res.status(400).json({ message: "Invalid OTP" });

      if (new Date(rows[0].expires_at) < new Date())
        return res.status(400).json({ message: "OTP expired" });

      db.query(
        "UPDATE email_otps SET verified=TRUE WHERE id=?",
        [rows[0].id],
        () => res.json({ message: "Email verified successfully" })
      );
    }
  );
});

module.exports = router;
