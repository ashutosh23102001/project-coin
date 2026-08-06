

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const PgSession = require("connect-pg-simple")(session);
const cookieParser = require("cookie-parser");
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
       ttl: 3 * 60 * 60, // 3 hours (seconds)
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
      maxAge: 3 * 60 * 60 * 1000,
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
app.use("/api", require("./routes/cover"));
app.use("/api", require("./routes/profilePic"));
app.use("/api", require("./routes/forgotPassword"));
app.use("/api", require("./routes/testEmail"));
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