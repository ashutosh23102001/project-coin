// //cd server > npm init >enter >enter > enter> check dependiencies > npm install express mysql cors 


// // =======================
// // IMPORTS
// // =======================
// const express = require("express");
// const cors = require("cors");
// const session = require("express-session");
// const cookieParser = require("cookie-parser");
// const db = require("./db");                 // ✅ DB FILE
// const accountRoutes = require("./routes/account"); // ✅ ACCOUNT ROUTES
// const loginRoutes = require("./routes/login"); // ✅ ACCOUNT ROUTES
// const app = express();

// // =======================
// // MIDDLEWARE
// // =======================
// app.use(express.json());

// app.use(
//   cors({
//     origin: "http://localhost:5173", // ✅ React URL
//     credentials: true                // 🔴 REQUIRED FOR SESSION
//   })
// );

// app.use(cookieParser());

// app.use(
//   session({
//     name: "dcoin.sid",
//     secret: "dcoin_secret_key",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       httpOnly: true,
//       secure: false,                 // 🔴 true ONLY in HTTPS
//       maxAge: 1000 * 60 * 60 * 24
//     }
//   })
// );

// // =======================
// // LOGIN
// // =======================
// app.post("/users", (req, res) => {
//   const { Username, password } = req.body;

//   const sql = "SELECT * FROM users WHERE username=? AND password=?";
//   db.query(sql, [Username, password], (err, data) => {
//     if (err) return res.status(500).json(err);

//     if (data.length > 0) {
//       // 🔴 SAVE USER IN SESSION
//       req.session.user = {
//         id: data[0].id,
//         username: data[0].username
//       };

//       return res.json({
//         message: "login successful",
//         user: req.session.user
//       });
//     }

//     res.json({ message: "user not found" });
//   });
// });

// // =======================
// // AUTH CHECK (IMPORTANT)
// // =======================
// app.get("/auth/me", (req, res) => {
//   res.json({
//     loggedIn: !!req.session.user,
//     user: req.session.user || null
//   });
// });

// // =======================
// // LOGOUT
// // =======================
// app.post("/logout", (req, res) => {
//   req.session.destroy(() => {
//     res.clearCookie("dcoin.sid");
//     res.json({ message: "Logged out successfully" });
//   });
// // });

// // =======================
// // ACCOUNT ROUTES
// // =======================
// app.use("/account", accountRoutes);

// // =======================
// // START SERVER
// // =======================
// app.listen(3002, () => {
//   console.log("✅ Server running on http://localhost:3002");
// });

// // =======================
// // REGISTER USER
// // =======================
// app.post("/register", (req, res) => {
//   const { Username, Email, Password } = req.body;

//   if (!Username || !Email || !Password) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   // 🔒 CHECK UNIQUE USERNAME
//   const checkSql = "SELECT id FROM users WHERE username=?";
//   db.query(checkSql, [Username], (err, result) => {
//     if (err) return res.status(500).json(err);

//     if (result.length > 0) {
//       return res.status(409).json({ message: "Username already exists" });
//     }

//     // ✅ INSERT USER
//     const insertSql =
//       "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";

//     db.query(insertSql, [Username, Email, Password], (err) => {
//       if (err) return res.status(500).json(err);

//       res.json({ message: "User registered successfully" });
//     });
//   });
// });

//part 2



// const express = require("express");
// const cors = require("cors");
// const session = require("express-session");
// const cookieParser = require("cookie-parser");
// const db = require("./db");
// const loginRoutes = require("./routes/login");
// const clicksRoutes = require("./routes/clicks");
// const coverRoutes = require("./routes/cover");
// require("dotenv").config();

// const accountRoutes = require("./routes/account");

// const app = express();

// app.use("/company", require("./routes/company"));
// app.use("/uploads", express.static("uploads"));
// const addressRoutes = require("./routes/address");



// // =======================
// // MIDDLEWARE
// // =======================
// app.use(express.json());

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true
//   })
// );

// app.use(cookieParser());

// app.use(
//   session({
//     name: "dcoin.sid",
//     secret: "dcoin_secret_key",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       httpOnly: true,
//       secure: false,
//       maxAge: 1000 * 60 * 60 * 24
//     }
//   })
// );


// // =======================
// // AUTH CHECK
// // =======================
// app.get("/api/auth/me", (req, res) => {
//   res.json({
//     loggedIn: !!req.session.user,
//     user: req.session.user || null
//   });
// });

// // =======================
// // login ROUTES
// // =======================
// app.use("/api/login", loginRoutes);     // 🔥 LOGIN / REGISTER / LOGOUT
// app.use("/api/account", accountRoutes);
// app.use("/api/clicks", clicksRoutes);         // /saveClickData
// app.use("/api/address", addressRoutes);
// app.use("/uploads", express.static("uploads"));

// app.use("/api/cover", require("./routes/cover"));
// app.use("/api/profile", require("./routes/profile"));



// app.listen(process.env.PORT);


// // =======================
// // START SERVER
// // =======================
// app.listen(3002, () => {
//   console.log("✅ Server running on http://localhost:3002");
// });



// // part 5
// const express = require("express");
// const cors = require("cors");
// const session = require("express-session");
// const cookieParser = require("cookie-parser");
// require("dotenv").config();

// const loginRoutes = require("./routes/login");
// const accountRoutes = require("./routes/account");

// const app = express();

// /* ===================== MIDDLEWARE ===================== */
// app.use(express.json());

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true
//   })
// );

// app.use(cookieParser());

// app.use(
//   session({
//     name: "dcoin.sid",
//     secret: "dcoin_secret_key",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       httpOnly: true,
//       secure: false,
//       maxAge: 1000 * 60 * 60 * 24
//     }
//   })
// );

// /* ===================== AUTH CHECK ===================== */
// app.get("/api/auth/me", (req, res) => {
//   res.json({
//     loggedIn: !!req.session.user,
//     user: req.session.user || null
//   });
// });

// /* ===================== ROUTES ===================== */
// app.use("/api", loginRoutes);
// app.use("/api", accountRoutes);

// /* ===================== START SERVER ===================== */
// const PORT = process.env.PORT || 3002;
// app.listen(PORT, () => {
//   console.log(`✅ Server running on http://localhost:${PORT}`);
// });

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const loginRoutes = require("./routes/login");
const accountRoutes = require("./routes/account");
const clickRoutes = require("./routes/clicks"); // ✅ ADDED


const app = express();

/* ============ MIDDLEWARE ============ */
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
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
      secure: false
    }
  })
);

/* ============ AUTH CHECK ============ */
app.get("/api/auth/me", (req, res) => {
  res.json({
    loggedIn: !!req.session.user,
    user: req.session.user || null
  });
});

/* ============ ROUTES ============ */
app.use("/api", loginRoutes);
app.use("/api/account", accountRoutes); // ✅ FIXED
app.use("/api", clickRoutes); // ✅ IMPORTANT FIX


/* ============ START SERVER ============ */
const PORT = 3002;
app.listen(PORT, () => {
  console.log("✅ Server running on http://localhost:" + PORT);
});
