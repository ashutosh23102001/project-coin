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
require("dotenv").config();

const mysql = require('mysql2');

// This pulls the long URI you just pasted into Render
const pool = mysql.createPool(process.env.DATABASE_URL);

pool.getConnection((err, connection) => {
    if (err) {
        console.error("❌ Database connection failed:", err.message);
    } else {
        console.log("✅ Successfully connected to Aiven MySQL!");
        connection.release();
    }
});