// //cd server > npm init >enter >enter > enter> check dependiencies > npm install express mysql cors 
require("dotenv").config();


const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const loginRoutes = require("./routes/login");
const accountRoutes = require("./routes/account");
const clickRoutes = require("./routes/clicks"); 
const companyRoutes = require("./routes/company");
const shortenerRoutes = require("./routes/shortener");
const addressRoutes = require("./routes/address");
const emailOtpRoutes = require("./routes/emailOtp");
const profilePicRoute = require("./routes/profilePic");
const path = require("path");
const forgotPasswordRoutes = require("./routes/forgotPassword");
const coverRoute = require("./routes/cover");
const referralRoutes = require("./routes/referral");
const pointsRoutes = require("./routes/points");




const app = express();

/* ============ MIDDLEWARE ============ */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
      secure: false,
      sameSite: "lax", // ✅ ADD THIS

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
app.use("/api/company", companyRoutes);     // ✅ Personal Settings
app.use("/api", shortenerRoutes);   // ✅ IMPORTANT
app.use("/api", addressRoutes);
app.use("/api", emailOtpRoutes); // ✅ OTP ENDPOINTS  

app.use("/api", profilePicRoute);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", require("./routes/profile"));          // profile data
app.use("/api", forgotPasswordRoutes);
app.use("/api", coverRoute);
app.use("/api", pointsRoutes);
app.use("/api", referralRoutes);


app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

/* ============ START SERVER ============ */
const PORT = 3002;
app.listen(PORT, () => {
  console.log("✅ Server running on http://localhost:" + PORT);
});
