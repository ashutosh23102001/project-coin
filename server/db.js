// const mysql = require("mysql");

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "dcoin"
// });

// db.connect((err) => {
//   if (err) {
//     console.error("❌ Database error:", err);
//   } else {
//     console.log("✅ Database connected");
//   }
// });

// module.exports = db;


// after deplyment changes

require("dotenv").config();
const mysql = require('mysql2');

// ⭐ FIX: Using a single Connection String is much safer for Aiven
const pool = mysql.createPool({
  uri: process.env.DATABASE_URL, // This contains host, user, password, and port
  ssl: {
    rejectUnauthorized: false // ⭐ FIX: Required for Aiven + Render to talk securely
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error("❌ Aiven Connection Failed:", err.message);
    } else {
        console.log("✅ Successfully connected to Aiven MySQL (defaultdb)!");
        connection.release();
    }
});

module.exports = pool.promise();