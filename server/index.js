// // //cd server > npm init >enter >enter > enter> check dependiencies > npm install express mysql cors 
// require("dotenv").config();


// const express = require("express");
// const cors = require("cors");
// const session = require("express-session");
// const cookieParser = require("cookie-parser");
// const mysql = require('mysql2'); // standard package for MySQL

// const loginRoutes = require("./routes/login");
// const accountRoutes = require("./routes/account");
// const clickRoutes = require("./routes/clicks"); 
// const companyRoutes = require("./routes/company");
// const shortenerRoutes = require("./routes/shortener");
// const addressRoutes = require("./routes/address");
// const emailOtpRoutes = require("./routes/emailOtp");
// const profilePicRoute = require("./routes/profilePic");
// const path = require("path");
// const forgotPasswordRoutes = require("./routes/forgotPassword");
// const coverRoute = require("./routes/cover");
// const referralRoutes = require("./routes/referral");
// const pointsRoutes = require("./routes/points");
// const profileRoute = require("./routes/profile"); // ⭐ FIX




// const app = express();

// /* ============ MIDDLEWARE ============ */
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // 1. COMBINE WITH VERCEL (FRONTEND)
// // This tells your server: "Only allow my Vercel React app to talk to me."

// app.use(
//   cors({
//   origin: "https://project-coin-zfh8-fmq85ff3h-ashutosh23102001s-projects.vercel.app",
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true
//   })
// );

// // 2. COMBINE WITH AIVEN (DATABASE)
// // This uses the hidden connection string you pasted into Render
// const db = mysql.createConnection(process.env.DB_URL);

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
//       sameSite: "lax", // ✅ ADD THIS

//     }
//   })
// );

// /* ============ AUTH CHECK ============ */
// app.get("/api/auth/me", (req, res) => {
//   res.json({
//     loggedIn: !!req.session.user,
//     user: req.session.user || null
//   });
// });

// app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // ⭐ FIX ONLY ONCE


// /* ============ ROUTES ============ */
// app.use("/api", loginRoutes);
// app.use("/api/account", accountRoutes); // ✅ FIXED
// app.use("/api", clickRoutes); // ✅ IMPORTANT FIX
// app.use("/api/company", companyRoutes);     // ✅ Personal Settings
// app.use("/api", shortenerRoutes);   // ✅ IMPORTANT
// app.use("/api", addressRoutes);
// app.use("/api", emailOtpRoutes); // ✅ OTP ENDPOINTS  
// app.use("/api", profileRoute); // ⭐ FIX

// app.use("/api", profilePicRoute);
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use("/api", require("./routes/profile"));          // profile data
// app.use("/api", forgotPasswordRoutes);
// app.use("/api", coverRoute);
// app.use("/api", pointsRoutes);
// app.use("/api", referralRoutes);



// /* ============ START SERVER ============ */
// const PORT = process.env.PORT || 21240;
// app.listen(PORT, () => {
//     console.log("✅ Server running on http://localhost:" + PORT);
// });



// after deplyment changes 

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require('mysql2'); 
// ... other imports

const app = express();

/* ============ MIDDLEWARE ============ */
app.use(express.json());

// ⭐ FIX: Use your MAIN Vercel domain (not the long git-preview one)
app.use(
  cors({
    origin: "https://project-coin-ashutosh23102001s-projects.vercel.app", 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  })
);

// ⭐ FIX: Use createPool instead of createConnection for better stability on Render
const db = mysql.createPool(process.env.DATABASE_URL); 

// ... rest of your session and routes code

/* ============ START SERVER ============ */
// ⭐ FIX: Render assigns its own port, don't force 21240 here
const PORT = process.env.PORT || 3002; 
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});

app.use(
  session({
    // ... other settings
    cookie: {
      httpOnly: true,
      secure: true, // ⭐ FIX: Must be true for HTTPS (Render/Vercel)
      sameSite: "none", // ⭐ FIX: Allows cookies across different domains
    },
    proxy: true // ⭐ FIX: Required for Render's load balancer
  })
);