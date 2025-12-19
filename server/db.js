const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
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
