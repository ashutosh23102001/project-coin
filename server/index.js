// //cd server > npm init >enter >enter > enter> check dependiencies > npm install express mysql cors 

// const express = require('express');
// const app   = express();
// const mysql = require('mysql');
// const cors  = require('cors');


// const session = require('express-session');
// const cookieParser = require('cookie-parser');
    


// app.use(express.json());

// // 🔹 UPDATED CORS (important for cookies)
// app.use(
//   cors({
//     origin: "http://localhost:5173", // React frontend
//     credentials: true
//   })
// );

// // 🔹 NEW
// app.use(cookieParser());

// // 🔹 NEW SESSION MIDDLEWARE
// app.use(
//   session({
//     name: "dcoin.sid",
//     secret: "dcoin_secret_key",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       httpOnly: true,
//       secure: false, // true in HTTPS
//       maxAge: 1000 * 60 * 60 * 24 // 1 day
//     }
//   })
// );

// // lets us runn the server
// app.listen(3002, ()=>{
//     console.log("Server is running on port 3002")
// })  

// // lets  create connection to database
// const db = mysql.createConnection({ 
//     user: 'root',
//     host: 'localhost',
//     password: '',
//     database: 'dcoin'
// })
// db.connect()
// console.log("DataBase connected successfully");

// //lets create a route to the server that will register user
// // app.post('/users',(req,res)=>{
// //    const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
   
// //    db.query(sql, [req.body.Username,req.body.password], (err, data)=>{
// //        if(err) return res.json("error");
// //        if(data.length > 0){
// //            return res.json("login successful");
// //        }else{ 
// //             return res.json("user not found"); }
// //    })
// // })
// app.post('/users', (req, res) => {
//   const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
  
//   db.query(sql, [req.body.Username, req.body.password], (err, data) => {
//     if (err) return res.json("error");

//     if (data.length > 0) {

//       // 🔹 SAVE USER IN SESSION
//       req.session.user = {
//         id: data[0].id,
//         username: data[0].username
//       };

//       return res.json({
//         message: "login successful",
//         user: req.session.user
//       });

//     } else { 
//       return res.json("user not found");
//     }
//   });
// });

// app.get('/checkAuth', (req, res) => {
//   if (!req.session.user) {
//     return res.status(401).json({ message: "Not logged in" });
//   }
//   res.json({
//     loggedIn: true,
//     user: req.session.user
//   });
// });


// app.post('/logout', (req, res) => {
//   req.session.destroy(() => {
//     res.clearCookie("dcoin.sid");
//     res.json({ message: "Logged out successfully" });
//   });
// });





// app.post('/register',(req,res)=>{
//     const sql = "INSERT INTO users (username,email,password) VALUES (?,?,?)";
//     const sentEmail = req.body.Email;
//     const sentUsername = req.body.Username;
//     const sentPassword = req.body.Password;
//     //getting data from the request body
//     const values = [sentUsername, sentEmail, sentPassword];
//     db.query(sql, values, (err, data)=>{
//         if(err) {
//             console.log(err);
//             return res.json("Error");
//         }
//         return res.json("User registered successfully");
//     })
// })

// // // NEW ROUTE to save click data
// // app.post('/saveClickData', (req, res) => {
// //     // Assuming you send username and clicks_added from the frontend
// //     const { username, clicks_added } = req.body; 

// //     // SQL query to insert data into the click_counter table
// //     const sql = "INSERT INTO click_counter (username, clicks_added) VALUES (?, ?)"; 
    
// //     // Check if the required data is present
// //     if (!username || typeof clicks_added === 'undefined') {
// //         return res.status(400).json({ message: "Missing username or clicks data" });
// //     }

// //     const values = [username, clicks_added];
    
// //     db.query(sql, values, (err, result) => {
// //         if (err) {
// //             console.error("Database error on saving clicks:", err);
// //             // Send a 500 status code for server error
// //             return res.status(500).json({ message: "Failed to save click data" });
// //         }
// //         // Send a 201 status code for successful creation
// //         return res.status(201).json({ 
// //             message: "Click data saved successfully",
// //             insertId: result.insertId 
// //         });
// //     });
// // });

// app.post('/saveClickData', (req, res) => {

//   if (!req.session.user) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   const { clicks_added } = req.body;
//   const username = req.session.user.username;

//   const sql = "INSERT INTO click_counter (username, clicks_added) VALUES (?, ?)";

//   if (typeof clicks_added === 'undefined') {
//     return res.status(400).json({ message: "Missing clicks data" });
//   }

//   db.query(sql, [username, clicks_added], (err, result) => {
//     if (err) {
//       return res.status(500).json({ message: "Failed to save click data" });
//     }

//     return res.status(201).json({
//       message: "Click data saved successfully",
//       insertId: result.insertId
//     });
//   });
// });


// // routes/auth.js
// router.get("/me", (req, res) => {
//   if (req.session.user) {
//     res.json({
//       loggedIn: true,
//       user: req.session.user
//     });
//   } else {
//     res.json({ loggedIn: false });
//   }
// });

// app.use("/auth", authRoutes);

// // part 2
 
// // =======================
// // IMPORTS
// // =======================
// const express = require("express");
// const mysql = require("mysql");
// const cors = require("cors");
// const session = require("express-session");
// const cookieParser = require("cookie-parser");

// const app = express();

// // =======================
// // MIDDLEWARES
// // =======================
// app.use(express.json());

// app.use(
//   cors({
//     origin: "http://localhost:5173", // React frontend
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
//       secure: false, // true only in HTTPS
//       maxAge: 1000 * 60 * 60 * 24 // 1 day
//     }
//   })
// );

// // =======================
// // DATABASE CONNECTION
// // =======================
// const db = mysql.createConnection({
//   user: "root",
//   host: "localhost",
//   password: "",
//   database: "dcoin"
// });

// db.connect((err) => {
//   if (err) {
//     console.error("Database connection failed:", err);
//     return;
//   }
//   console.log("Database connected successfully");
// });

// // =======================
// // AUTH ROUTES
// // =======================

// // 🔐 LOGIN
// app.post("/users", (req, res) => {
//   const { Username, password } = req.body;

//   const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
//   db.query(sql, [Username, password], (err, data) => {
//     if (err) return res.status(500).json({ message: "DB Error" });

//     if (data.length > 0) {
//       req.session.user = {
//         id: data[0].id,
//         username: data[0].username
//       };

//       return res.json({
//         message: "login successful",
//         user: req.session.user
//       });
//     } else {
//       return res.json({ message: "user not found" });
//     }
//   });
// });

// // 🔍 CHECK SESSION (USED BY AuthContext)
// app.get("/auth/me", (req, res) => {
//   if (req.session.user) {
//     res.json({
//       loggedIn: true,
//       user: req.session.user
//     });
//   } else {
//     res.json({ loggedIn: false });
//   }
// });

// // 🚪 LOGOUT
// app.post("/logout", (req, res) => {
//   req.session.destroy(() => {
//     res.clearCookie("dcoin.sid");
//     res.json({ message: "Logged out successfully" });
//   });
// });

// // 📝 REGISTER
// app.post("/register", (req, res) => {
//   const { Username, Email, Password } = req.body;

//   const sql =
//     "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
//   db.query(sql, [Username, Email, Password], (err) => {
//     if (err) return res.status(500).json({ message: "Register failed" });

//     res.json({ message: "User registered successfully" });
//   });
// });

// // =======================
// // PROTECTED ROUTE
// // =======================
// app.post("/saveClickData", (req, res) => {
//   if (!req.session.user) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   const { clicks_added } = req.body;
//   const username = req.session.user.username;

//   const sql =
//     "INSERT INTO click_counter (username, clicks_added) VALUES (?, ?)";

//   db.query(sql, [username, clicks_added], (err, result) => {
//     if (err)
//       return res.status(500).json({ message: "Failed to save click data" });

//     res.status(201).json({
//       message: "Click data saved successfully",
//       insertId: result.insertId
//     });
//   });
// });

// // =======================
// // START SERVER
// // =======================
// app.listen(3002, () => {
//   console.log("Server running on http://localhost:3002");
// });

// const accountRoutes = require("./routes/account");
// app.use("/account", accountRoutes);


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
