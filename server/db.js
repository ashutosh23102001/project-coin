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
const mysql = require('mysql2');

// Use the URI from Render's environment variable
const connection = mysql.createConnection(process.env.DATABASE_URL);

// This code runs every time the server starts
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

connection.connect((err) => {
  if (err) {
    console.error('Aiven Connection Error: ' + err.message);
    return;
  }
  console.log('Connected to Aiven MySQL (dcoin)!');
});