const mysql = require("mysql");

const db = mysql.createConnection({
  host: "if0_41337665",
  user: "sql203.infinityfree.com",
  password: "Bittu231310",
  database: "if0_41337665_dcoin"
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database error:", err);
  } else {
    console.log("✅ Database connected");
  }
});

module.exports = db;
