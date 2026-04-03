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
 -- 1. Table: users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    referral_code VARCHAR(50) DEFAULT NULL
);

-- 2. Table: users_info
CREATE TABLE IF NOT EXISTS users_info (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50) DEFAULT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone_number VARCHAR(15) DEFAULT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255) DEFAULT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(20) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Table: user_media
CREATE TABLE IF NOT EXISTS user_media (
    user_id INT NOT NULL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    profile_pic_url VARCHAR(255) DEFAULT NULL,
    cover_pic_url VARCHAR(255) DEFAULT NULL,
    INDEX idx_username (username)
);

-- 4. Table: referrals
CREATE TABLE IF NOT EXISTS referrals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    referrer_username VARCHAR(100) DEFAULT NULL,
    referred_username VARCHAR(100) DEFAULT NULL,
    reward_given TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Table: email_otps
CREATE TABLE IF NOT EXISTS email_otps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    expires_at DATETIME NOT NULL,
    verified TINYINT(1) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6. Table: click_counter
CREATE TABLE IF NOT EXISTS click_counter (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    clicks_added INT DEFAULT 0,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Table: short_urls
CREATE TABLE IF NOT EXISTS short_urls (
    id INT AUTO_INCREMENT PRIMARY KEY,
    long_url TEXT NOT NULL,
    short_code VARCHAR(50) NOT NULL UNIQUE,
    created_by VARCHAR(50) DEFAULT NULL,
    clicks INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
  );
`;

connection.connect((err) => {
  if (err) {
    console.error('Aiven Connection Error: ' + err.message);
    return;
  }
  console.log('Connected to Aiven MySQL (dcoin)!');
});