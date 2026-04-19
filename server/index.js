// // //cd server > npm init >enter >enter > enter> check dependiencies > npm install express mysql cors 

// // try 

// require("dotenv").config();

// const express = require("express");
// const cors = require("cors");
// const session = require("express-session");
// const cookieParser = require("cookie-parser");
// const mysql = require("mysql2");
// const path = require("path");
// const MySQLStore = require("express-mysql-session")(session); // ✅ ADDED

// /* ============ ROUTES ============ */
// const loginRoutes = require("./routes/login");
// // const accountRoutes = require("./routes/account");
// // const clickRoutes = require("./routes/clicks");
// // const companyRoutes = require("./routes/personal");
// // const shortenerRoutes = require("./routes/shortener");
// // const addressRoutes = require("./routes/address");
// // const emailOtpRoutes = require("./routes/emailOtp");
// // const profilePicRoute = require("./routes/profilePic");
// // const forgotPasswordRoutes = require("./routes/forgotPassword");
// // const coverRoute = require("./routes/cover");
// const referralRoutes = require("./routes/referral");
// // const pointsRoutes = require("./routes/points");
// const profileRoute = require("./routes/profile");

// const app = express();

// /* ============ TRUST PROXY (IMPORTANT FOR RENDER) ============ */
// app.set("trust proxy", 1);

// /* ============ CORS (FIRST) ============ */
// app.use(
//   cors({
//     origin: [
//       "https://project-coin-ashutosh23102001s-projects.vercel.app",
//       "https://project-coin-zfh8.vercel.app",
//     ],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   })
// );


// /* ============ DATABASE (FIXED) ============ */
// const db = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

// // Test DB
// db.getConnection((err, conn) => {
//   if (err) {
//     console.error("❌ DB ERROR:", err.message);
//   } else {
//     console.log("✅ DB CONNECTED");
//     conn.release();
//   }
// });
// const sessionStore = new MySQLStore({}, db.promise()); // ✅ ADD THIS


// /* ============ MIDDLEWARE ============ */
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// /* ============ SESSION ============ */
// app.use(
//   session({
//     name: "dcoin.sid",
//     secret: process.env.SESSION_SECRET, // 🔥 must be in Render env
//     resave: false,
//     saveUninitialized: false,
//         store: sessionStore, // ✅ ADD THIS LINE

//     cookie: {
//   httpOnly: true,
//   secure: true,     // ✅ already correct
//   sameSite: "none", // ✅ already correct
//   maxAge: 1000 * 60 * 60 * 24, // 🔥 ADD THIS (IMPORTANT)
// },
//   })
// );

// /* ============ STATIC FILES ============ */
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// /* ============ AUTH CHECK ============ */
// app.get("/api/auth/me", (req, res) => {
//   res.json({
//     loggedIn: !!req.session.user,
//     user: req.session.user || null,
//   });
// });

// /* ============ ROUTES ============ */
// app.use("/api", loginRoutes);
// // app.use("/api/account", accountRoutes);
// // app.use("/api", clickRoutes);
// // app.use("/api/company", companyRoutes);
// // app.use("/api", shortenerRoutes);
// // app.use("/api", addressRoutes);
// // app.use("/api", emailOtpRoutes);
// app.use("/api", profileRoute);
// // app.use("/api", profilePicRoute);
// // app.use("/api", forgotPasswordRoutes);
// // app.use("/api", coverRoute);
// // app.use("/api", pointsRoutes);
// app.use("/api", referralRoutes);

// /* ============ ROOT CHECK ============ */
// app.get("/", (req, res) => {
//   res.send("🚀 API running: https://project-coin.onrender.com/api");
// });

// /* ============ START SERVER (LAST) ============ */
// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log(`✅ Server running on port ${PORT}`);
// });


require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const mysql = require("mysql2");
const path = require("path");
const MySQLStore = require("express-mysql-session")(session);

/* ============ ROUTES ============ */
const loginRoutes = require("./routes/login");
const referralRoutes = require("./routes/referral");
const profileRoute = require("./routes/profile");
const accountRoutes = require("./routes/account");
const personalRoutes = require("./routes/personal");
const addressRoutes = require("./routes/address");
const emailOtpRoutes = require("./routes/emailOtp");
const pointsRoutes = require("./routes/points");
const clickRoutes = require("./routes/clicks");





const app = express();

/* ✅ FIX 1: TRUST PROXY */
app.set("trust proxy", 1);

/* ✅ FIX 2: CORS */
app.use(
  cors({
    origin: [
        "https://project-coin-ashu.vercel.app"


    ],
    credentials: true,
  })
);

/* ✅ FIX 3: DATABASE (EXPORT THIS) */
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false },
});

/* ✅ IMPORTANT: EXPORT DB */
module.exports = db;

/* TEST DB */
db.getConnection((err, conn) => {
  if (err) console.error("❌ DB ERROR:", err.message);
  else {
    console.log("✅ DB CONNECTED");
    conn.release();
  }
});

/* ✅ SESSION STORE */
const sessionStore = new MySQLStore({}, db.promise());

/* MIDDLEWARE */
app.use(express.json());
app.use(cookieParser());

/* ✅ FIX 4: SESSION */
app.use(
  session({
    name: "dcoin.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

/* ROUTES */
app.use("/api", loginRoutes);
app.use("/api", profileRoute);
app.use("/api", referralRoutes);
app.use("/api/account", accountRoutes);
app.use("/api/personal", personalRoutes);
app.use("/api", addressRoutes);
app.use("/api", emailOtpRoutes);
app.use("/api", pointsRoutes);
app.use("/api", clickRoutes);








/* TEST */
app.get("/", (req, res) => {
  res.send("🚀 API running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});