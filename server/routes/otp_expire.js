// otp_expire.js
const db = require("./db"); // adjust path if needed

// ⏱ Run every 1 minute
setInterval(() => {
  const sql = `
    DELETE FROM email_otps
    WHERE created_at < (NOW() - INTERVAL 2 MINUTE)
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("❌ OTP cleanup failed:", err);
    } else if (result.affectedRows > 0) {
      console.log(`🧹 Deleted ${result.affectedRows} expired OTP(s)`);
    }
  });
}, 60 * 1000); // every 60 seconds
