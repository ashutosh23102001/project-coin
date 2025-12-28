// //cd server > npm init >enter >enter > enter> check dependiencies > npm install express mysql cors 


const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const loginRoutes = require("./routes/login");
const accountRoutes = require("./routes/account");
const clickRoutes = require("./routes/clicks"); // ✅ ADDED
const companyRoutes = require("./routes/company");


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
app.use("/api/company", companyRoutes);


/* ============ START SERVER ============ */
const PORT = 3002;
app.listen(PORT, () => {
  console.log("✅ Server running on http://localhost:" + PORT);
});
