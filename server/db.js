const mysql = require("mysql");

const db = mysql.createConnection({
  host: "mysql-2b095c31-ashutosh23102001-73c6.f.aivencloud.com",
  user: "avnadmin",
  password: "<redacted>",
  database: "dcoin"
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database error:", err);
  } else {
    console.log("✅ Database connected");
  }
});

module.exports = db;
