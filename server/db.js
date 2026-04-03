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

connection.connect((err) => {
  if (err) {
    console.error('Aiven Connection Error: ' + err.message);
    return;
  }
  console.log('Connected to Aiven MySQL (dcoin)!');
});