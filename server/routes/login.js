

// const express = require("express");
// const bcrypt = require("bcryptjs");
// const db = require("../db");

// const router = express.Router();

// /* ======================
//    LOGIN
// ====================== */
// router.post("/login", async (req, res) => {
//   const { Username, password } = req.body;

//   db.query(
//     "SELECT * FROM users WHERE username=?",
//     [Username],
//     async (err, rows) => {
//       if (err) return res.status(500).json({ message: "DB error" });

//       if (!rows.length)
//         return res.status(401).json({ message: "Invalid login" });

//       const ok = await bcrypt.compare(password, rows[0].password);
//       if (!ok)
//         return res.status(401).json({ message: "Invalid login" });

//       // ✅ SESSION SET
//       req.session.user = {
//         id: rows[0].id,          // 🔴 users.id
//         username: rows[0].username
//       };

//       // 🔴 🔴 🔴 MAIN FIX
//       // ENSURE users_info ROW EXISTS
//       db.query(
//         "SELECT user_id FROM users_info WHERE user_id=?",
//         [rows[0].id],
//         (err, infoRows) => {
//           if (!infoRows.length) {
//             db.query(
//               "INSERT INTO users_info (user_id, username) VALUES (?, ?)",
//               [rows[0].id, rows[0].username]
//             );
//           }
//         }
//       );

//       res.json({
//         message: "Login successful",
//         user: req.session.user
//       });
//     }
//   );
// });

// // /* ================= LOGOUT ================= */
// router.post("/logout", (req, res) => {
//   req.session.destroy(() => {
//     res.clearCookie("dcoin.sid");
//     res.json({ message: "Logged out successfully" });
//   });
// });



// function generateCode(username) {
//   return (
//     username.slice(0, 3).toUpperCase() +
//     Math.random().toString(36).substring(2, 6).toUpperCase()
//   );
// }

// /* ======================
//    REGISTER WITH REFERRAL
// ====================== */
// router.post("/register", async (req, res) => {
//   try {
//     const { username, password, referralCode } = req.body;

//     if (!username || !password) {
//       return res.status(400).json({ message: "All fields required" });
//     }

//     if (password.length < 6) {
//       return res.status(400).json({
//         message: "Password must be at least 6 characters"
//       });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const myReferralCode = generateCode(username);

//     // 1️⃣ CREATE USER
//     db.query(
//       `INSERT INTO users (username, password, referral_code)
//        VALUES (?, ?, ?)`,
//       [username, hashedPassword, myReferralCode],
//       (err) => {
//         if (err) {
//           if (err.code === "ER_DUP_ENTRY") {
//             return res
//               .status(409)
//               .json({ message: "Username already exists" });
//           }
//           console.error("Register error:", err);
//           return res.status(500).json({ message: "Server error" });
//         }

//         // 2️⃣ HANDLE REFERRAL (IF PROVIDED)
//         if (referralCode) {
//           db.query(
//             `SELECT username FROM users WHERE referral_code = ?`,
//             [referralCode],
//             (err, rows) => {
//               if (!rows || !rows.length) return;

//               const referrer = rows[0].username;

//               // save referral
//               db.query(
//                 `INSERT INTO referrals (referrer_username, referred_username)
//                  VALUES (?, ?)`,
//                 [referrer, username]
//               );

//               // 🎁 reward referrer
//               db.query(
//                 `INSERT INTO click_counter (username, clicks_added)
//                  VALUES (?, 20)`,
//                 [referrer]
//               );
//             }
//           );
//         }

//         res.json({ success: true });
//       }
//     );
//   } catch (error) {
//     console.error("Register crash:", error);
//     res.status(500).json({ message: "Server crash" });
//   }
// });



// module.exports = router;

// part...

// const express = require("express");
// const bcrypt = require("bcryptjs");
// const db = require("../db");

// const router = express.Router();

// /* ======================
//    LOGIN
// ====================== */
// router.post("/login", async (req, res) => {
//   const { Username, password } = req.body;

//   db.query(
//     "SELECT * FROM users WHERE username=?",
//     [Username],
//     async (err, rows) => {
//       if (err) return res.status(500).json({ message: "DB error" });

//       if (!rows.length)
//         return res.status(401).json({ message: "Invalid login" });

//       const ok = await bcrypt.compare(password, rows[0].password);
//       if (!ok)
//         return res.status(401).json({ message: "Invalid login" });

//       req.session.user = {
//         id: rows[0].id,
//         username: rows[0].username,
//       };

//       res.json({
//         message: "Login successful",
//         user: req.session.user,
//       });
//     }
//   );
// });
const express = require("express");
const router = express.Router();
const db = require("../db"); // ✅ IMPORTANT

router.post("/login", async (req, res) => {
  try {
    // ✅ FIX: match frontend field
    const { Username, password } = req.body;

    if (!Username || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const [rows] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [Username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = rows[0];

    // ⚠️ Plain password check (later use bcrypt)
    if (user.password !== password) {
      return res.status(401).json({ message: "Wrong password" });
    }

    // ✅ SESSION SAVE
    req.session.user = {
      id: user.id,
      username: user.username,
    };

    // ✅ RESPONSE
    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
      },
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router; // ✅ VERY IMPORTANT






// // /* ================= LOGOUT ================= */
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("dcoin.sid");
    res.json({ message: "Logged out successfully" });
  });
});


/* ======================
   REGISTER WITH REFERRAL
====================== */

/* ======================
   HELPER: GENERATE REFERRAL CODE
====================== */
function generateCode(username) {
  return (
    username.slice(0, 3).toUpperCase() +
    Math.random().toString(36).substring(2, 6).toUpperCase()
  );
}

/* ======================
   REGISTER WITH REFERRAL
====================== */
router.post("/register", async (req, res) => {
  try {
    const { username, password, referralCode } = req.body;

    /* =================================================
       🔧 CORRECTION 1: VALIDATION RESPONSE FORMAT
    ================================================= */
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const myReferralCode = generateCode(username);

    /* ======================
       1️⃣ CREATE USER
    ====================== */
    db.query(
      `INSERT INTO users (username, password, referral_code)
       VALUES (?, ?, ?)`,
      [username, hashedPassword, myReferralCode],
      (err) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            /* =================================================
               🔧 CORRECTION 2: DUPLICATE USERNAME
            ================================================= */
            return res.status(409).json({
              success: false,
              message: "Username already exists",
            });
          }

          console.error("Register error:", err);
          return res.status(500).json({
            success: false,
            message: "Server error",
          });
        }

        /* ======================
           2️⃣ HANDLE REFERRAL (IF PROVIDED)
           🔧 RESTORED QUERY (AS REQUESTED)
        ====================== */
        if (referralCode) {
          db.query(
            `SELECT username FROM users WHERE referral_code = ?`,
            [referralCode],
            (err, rows) => {
              if (err) {
                console.error("Referral lookup error:", err);
                return;
              }

              if (!rows || !rows.length) return;

              const referrer = rows[0].username;

              // save referral relationship
              db.query(
                `INSERT INTO referrals (referrer_username, referred_username)
                 VALUES (?, ?)`,
                [referrer, username]
              );

              // 🎁 reward referrer
              db.query(
                `INSERT INTO click_counter (username, clicks_added)
                 VALUES (?, 20)`,
                [referrer]
              );
            }
          );
        }

        /* ======================
           3️⃣ SUCCESS RESPONSE
           🔧 CORRECTION 3: CONSISTENT SUCCESS FORMAT
        ====================== */
        return res.status(201).json({
          success: true,
          message: "User registered successfully",
        });
      }
    );
  } catch (error) {
    console.error("Register crash:", error);
    return res.status(500).json({
      success: false,
      message: "Server crash",
    });
  }
});

module.exports = router;