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

/**
 * ⭐ FIX 1: Use 'uri' (or 'connectionString' in some versions) 
 * ⭐ FIX 2: Explicitly define SSL for Aiven Cloud
 */
const pool = mysql.createPool({
  
 host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT, // ⭐ CORRECTION: Ensure this is defined in Render Environment


  ssl: {
    rejectUnauthorized: false   // ⭐ CORRECTION: Required for Render to talk to Aiven
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection on startup
pool.getConnection((err, connection) => {
    if (err) {
        console.error("❌ Aiven Connection Failed:", err.message);
    } else {
        console.log("✅ Successfully connected to Aiven MySQL (defaultdb)!");
        connection.release(); 
    }
});

/**
 * ⭐ FIX 3: Export as .promise() 
 * This allows you to use 'await db.query()' in your routes
 */
module.exports = pool.promise();