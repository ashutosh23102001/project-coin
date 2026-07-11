// // server/otp_expire.js

// const express = require("express");
// const db = require("../db");

// const router = express.Router();
// // ⏱ Run every 30 seconds (safe + accurate)
// setInterval(() => {
//   const sql = `
//     DELETE FROM email_otps
//     WHERE expires_at <= NOW()
//   `;

//   db.query(sql, (err, result) => {
//     if (err) {
//       console.error("❌ OTP cleanup failed:", err);
//     } else if (result.affectedRows > 0) {
//       console.log(`🧹 Deleted ${result.affectedRows} expired OTP(s)`);
//     }
//   });
// }, 120 * 1000); // every 60 seconds


const db = require("./db");

// Run every 2 minutes
setInterval(async () => {
  try {
    const result = await db.query(`
      DELETE FROM email_otps
      WHERE expires_at <= NOW()
    `);

    if (result.rowCount > 0) {
      console.log(`🧹 Deleted ${result.rowCount} expired OTP(s)`);
    }
  } catch (err) {
    console.error("❌ OTP cleanup failed:", err.message);
  }
}, 120 * 1000);