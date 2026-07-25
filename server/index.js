// // //cd server > npm init >enter >enter > enter> check dependiencies > npm install express mysql cors 

// // try 


// require("dotenv").config();

// const express = require("express");
// const cors = require("cors");
// const session = require("express-session");
// const cookieParser = require("cookie-parser");
// const mysql = require("mysql2");
// const path = require("path");
// const MySQLStore = require("express-mysql-session")(session);

// /* ============ ROUTES ============ */
// const loginRoutes = require("./routes/login");
// const referralRoutes = require("./routes/referral");
// const profileRoute = require("./routes/profile");
// const accountRoutes = require("./routes/account");
// const personalRoutes = require("./routes/personal");
// const addressRoutes = require("./routes/address");
// const emailOtpRoutes = require("./routes/emailOtp");
// const pointsRoutes = require("./routes/points");
// const clickRoutes = require("./routes/clicks");





// const app = express();

// /* ✅ FIX 1: TRUST PROXY */
// app.set("trust proxy", 1);

// /* ✅ FIX 2: CORS */
// app.use(
//   cors({
//     origin: [
//         "https://project-coin-ashu.vercel.app"


//     ],
//     credentials: true,
//   })
// );

// // /* ✅ FIX 3: DATABASE (EXPORT THIS) */
// // const db = mysql.createPool({
// //   host: process.env.DB_HOST,
// //   user: process.env.DB_USER,
// //   password: process.env.DB_PASSWORD,
// //   database: process.env.DB_NAME,
// //   port: process.env.DB_PORT,
// //   ssl: { rejectUnauthorized: false },
// // });

// // /* ✅ IMPORTANT: EXPORT DB */
// // module.exports = db;

// // /* TEST DB */
// // db.getConnection((err, conn) => {
// //   if (err) console.error("❌ DB ERROR:", err.message);
// //   else {
// //     console.log("✅ DB CONNECTED");
// //     conn.release();
// //   }
// // });

// const { Pool } = require("pg");

// const db = new Pool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

// /* ✅ EXPORT DB */
// module.exports = db;

// /* ✅ TEST DB */
// db.connect((err, client, release) => {
//   if (err) {
//     console.error("❌ DB ERROR:", err.message);
//   } else {
//     console.log("✅ SUPABASE CONNECTED");
//     release();
//   }
// });

// /* ✅ SESSION STORE */
// const sessionStore = new MySQLStore({}, db.promise());

// /* MIDDLEWARE */
// app.use(express.json());
// app.use(cookieParser());

// /* ✅ FIX 4: SESSION */
// app.use(
//   session({
//     name: "dcoin.sid",
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     store: sessionStore,
//     cookie: {
//       httpOnly: true,
//       secure: true,
//       sameSite: "none",
//       maxAge: 1000 * 60 * 60 * 24,
//     },
//   })
// );

// /* ROUTES */
// app.use("/api", loginRoutes);
// app.use("/api", profileRoute);
// app.use("/api", referralRoutes);
// app.use("/api/account", accountRoutes);
// app.use("/api/personal", personalRoutes);
// app.use("/api", addressRoutes);
// app.use("/api", emailOtpRoutes);
// app.use("/api", pointsRoutes);
// app.use("/api", clickRoutes);








// /* TEST */
// app.get("/", (req, res) => {
//   res.send("🚀 API running");
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`✅ Server running on port ${PORT}`);
// });


require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const PgSession = require("connect-pg-simple")(session);
const cookieParser = require("cookie-parser");
const forgotPasswordRoute = require("./routes/forgotPassword");
const db = require("./db");

const app = express();

app.set("trust proxy", 1);
const allowedOrigins = [
  "http://localhost:5173",
  "https://project-coin-ashu.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

app.use(
  session({
    store: new PgSession({
      pool: db,
      tableName: "session",
    }),
    name: "dcoin.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

/* Routes */
app.use("/api", require("./routes/login"));
app.use("/api/account", require("./routes/account"));
app.use("/api/personal", require("./routes/personal"));
app.use("/api", require("./routes/profile"));
app.use("/api", require("./routes/referral"));
app.use("/api", require("./routes/address"));
app.use("/api", require("./routes/emailOtp"));
app.use("/api", require("./routes/points"));
app.use("/api", require("./routes/clicks"));
app.use("/api", forgotPasswordRoute);
app.use("/api", require("./routes/cover"));
app.use("/api", require("./routes/profilePic"));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 Project Coin API Running",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});