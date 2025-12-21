// //cd server > npm init >enter >enter > enter> check dependiencies > npm install express mysql cors 


// part 3
// =======================
// IMPORTS
// =======================
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const db = require("./db");                 // ✅ DB FILE
const accountRoutes = require("./routes/account"); // ✅ ACCOUNT ROUTES

const app = express();

// =======================
// MIDDLEWARE
// =======================
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173", // ✅ React URL
    credentials: true                // 🔴 REQUIRED FOR SESSION
  })
);

app.use(cookieParser());

app.use(
  session({
    name: "dcoin.sid",
    secret: "dcoin_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,                 // 🔴 true ONLY in HTTPS
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);

// =======================
// LOGIN
// =======================
app.post("/users", (req, res) => {
  const { Username, password } = req.body;

  const sql = "SELECT * FROM users WHERE username=? AND password=?";
  db.query(sql, [Username, password], (err, data) => {
    if (err) return res.status(500).json(err);

    if (data.length > 0) {
      // 🔴 SAVE USER IN SESSION
      req.session.user = {
        id: data[0].id,
        username: data[0].username
      };

      return res.json({
        message: "login successful",
        user: req.session.user
      });
    }

    res.json({ message: "user not found" });
  });
});

// =======================
// AUTH CHECK (IMPORTANT)
// =======================
app.get("/auth/me", (req, res) => {
  res.json({
    loggedIn: !!req.session.user,
    user: req.session.user || null
  });
});

// =======================
// LOGOUT
// =======================
app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("dcoin.sid");
    res.json({ message: "Logged out successfully" });
  });
});

// =======================
// ACCOUNT ROUTES
// =======================
app.use("/account", accountRoutes);

// =======================
// START SERVER
// =======================
app.listen(3002, () => {
  console.log("✅ Server running on http://localhost:3002");
});

// =======================
// REGISTER USER
// =======================
app.post("/register", (req, res) => {
  const { Username, Email, Password } = req.body;

  if (!Username || !Email || !Password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // 🔒 CHECK UNIQUE USERNAME
  const checkSql = "SELECT id FROM users WHERE username=?";
  db.query(checkSql, [Username], (err, result) => {
    if (err) return res.status(500).json(err);

    if (result.length > 0) {
      return res.status(409).json({ message: "Username already exists" });
    }

    // ✅ INSERT USER
    const insertSql =
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";

    db.query(insertSql, [Username, Email, Password], (err) => {
      if (err) return res.status(500).json(err);

      res.json({ message: "User registered successfully" });
    });
  });
});

// =======================
// SAVE CLICK DATA (PROTECTED)
// =======================
app.post("/saveClickData", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { clicks_added } = req.body;
  const username = req.session.user.username;

  if (typeof clicks_added !== "number") {
    return res.status(400).json({ message: "Invalid clicks" });
  }

  const sql =
    "INSERT INTO click_counter (username, clicks_added) VALUES (?, ?)";

  db.query(sql, [username, clicks_added], (err) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ message: "DB Error" });
    }

    res.json({ message: "Clicks saved successfully" });
  });
});
