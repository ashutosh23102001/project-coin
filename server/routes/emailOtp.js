





const express = require("express");
const db = require("../db");
const nodemailer = require("nodemailer");
const cron = require("node-cron");

const router = express.Router();

/* ================= FETCH EMAIL ================= */
router.get("/get-email", (req, res) => {
  if (!req.session.user)
    return res.status(401).json({ message: "Unauthorized" });

  db.query(
    "SELECT email FROM users_info WHERE user_id=?",
    [req.session.user.id],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "DB error" });
      res.json({ email: rows[0]?.email || "" });
    }
  );
});

/* ================= OTP ================= */
const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/* ================= SEND OTP ================= */
router.post("/send-email-otp", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  db.query(
    `SELECT id FROM email_otps
     WHERE email=? AND verified=0 AND expires_at > NOW()
     LIMIT 1`,
    [email],
    async (err, rows) => {
      if (err) return res.status(500).json({ message: "DB error" });

      if (rows.length)
        return res.status(429).json({ message: "OTP already sent. Please wait." });

      const otp = generateOtp();
      const expiresAt = new Date(Date.now() + 60 * 1000);

      db.query(
        `INSERT INTO email_otps (email, otp, expires_at, verified)
         VALUES (?, ?, ?, 0)`,
        [email, otp, expiresAt],
        async err2 => {
          if (err2) return res.status(500).json({ message: "DB error" });

          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Email OTP",
            html: `<h1>${otp}</h1><p>Valid for 1 minute</p>`
          });

          res.json({ message: "OTP sent" });
        }
      );
    }
  );
});

/* ================= VERIFY OTP ================= */
router.post("/verify-email-otp", (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp)
    return res.status(400).json({ message: "Email & OTP required" });

  if (!req.session.user)
    return res.status(401).json({ message: "Unauthorized" });

  const userId = req.session.user.id;

  db.query(
    `SELECT * FROM email_otps
     WHERE email=? AND otp=? AND verified=0
     ORDER BY created_at DESC
     LIMIT 1`,
    [email, otp],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "DB error" });
      if (!rows.length)
        return res.status(400).json({ message: "Invalid or expired OTP" });

      const record = rows[0];
      if (new Date(record.expires_at) < new Date())
        return res.status(400).json({ message: "OTP expired" });

      db.query("UPDATE email_otps SET verified=1 WHERE id=?", [record.id]);

      /* ✅ SAFE SAVE — EMAIL CAN BE SHARED */
      db.query(
        "UPDATE users_info SET email=? WHERE user_id=?",
        [email, userId],
        err2 => {
          if (err2) {
            console.error("Save email error:", err2);
            return res.status(500).json({ message: "Failed to save email" });
          }
          res.json({ message: "Email verified successfully" });
        }
      );
    }
  );
});

/* ================= CLEAN EXPIRED OTP ================= */
cron.schedule("* * * * *", () => {
  db.query("DELETE FROM email_otps WHERE expires_at < NOW()");
});

module.exports = router;
