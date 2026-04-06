

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
const bcrypt = require("bcryptjs");
const db = require("../db");

const router = express.Router();

/* ======================
   LOGIN (FINAL FIXED)
====================== */
router.post("/login", async (req, res) => {
  try {
    const { Username, password } = req.body;

    // ✅ VALIDATION
    if (!Username || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // ✅ FETCH USER
    const [rows] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [Username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid login" });
    }

    const user = rows[0];

    // ✅ PASSWORD CHECK (bcrypt)
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid login" });
    }

    // ✅ SESSION SAVE
    req.session.user = {
      id: user.id,
      username: user.username,
    };

    // ✅ RESPONSE
    res.json({
      success: true,
      message: "Login successful",
      user: req.session.user,
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});




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

// /* ======================
//    REGISTER WITH REFERRAL
// ====================== */
// router.post("/register", async (req, res) => {
//   try {
//     const { username, password, referralCode } = req.body;

//     /* =================================================
//        🔧 CORRECTION 1: VALIDATION RESPONSE FORMAT
//     ================================================= */
//     if (!username || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields required",
//       });
//     }

//     if (password.length < 6) {
//       return res.status(400).json({
//         success: false,
//         message: "Password must be at least 6 characters",
//       });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const myReferralCode = generateCode(username);

//     /* ======================
//        1️⃣ CREATE USER
//     ====================== */
//     db.query(
//       `INSERT INTO users (username, password, referral_code)
//        VALUES (?, ?, ?)`,
//       [username, hashedPassword, myReferralCode],
//       (err) => {
//         if (err) {
//           if (err.code === "ER_DUP_ENTRY") {
//             /* =================================================
//                🔧 CORRECTION 2: DUPLICATE USERNAME
//             ================================================= */
//             return res.status(409).json({
//               success: false,
//               message: "Username already exists",
//             });
//           }

//           console.error("Register error:", err);
//           return res.status(500).json({
//             success: false,
//             message: "Server error",
//           });
//         }

//         /* ======================
//            2️⃣ HANDLE REFERRAL (IF PROVIDED)
//            🔧 RESTORED QUERY (AS REQUESTED)
//         ====================== */
//         if (referralCode) {
//           db.query(
//             `SELECT username FROM users WHERE referral_code = ?`,
//             [referralCode],
//             (err, rows) => {
//               if (err) {
//                 console.error("Referral lookup error:", err);
//                 return;
//               }

//               if (!rows || !rows.length) return;

//               const referrer = rows[0].username;

//               // save referral relationship
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

//         /* ======================
//            3️⃣ SUCCESS RESPONSE
//            🔧 CORRECTION 3: CONSISTENT SUCCESS FORMAT
//         ====================== */
//         return res.status(201).json({
//           success: true,
//           message: "User registered successfully",
//         });
//       }
//     );
//   } catch (error) {
//     console.error("Register crash:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server crash",
//     });
//   }
// });

// module.exports = router;


// // after without referal code


// /* ======================
//    REGISTER WITH REFERRAL (FINAL FIX)
// ====================== */
// router.post("/register", async (req, res) => {
//   try {
//     const { username, password, referralCode } = req.body;

//     /* ================= VALIDATION ================= */
//     if (!username || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields required",
//       });
//     }

//     if (password.length < 6) {
//       return res.status(400).json({
//         success: false,
//         message: "Password must be at least 6 characters",
//       });
//     }

//     /* ================= CHECK USER ================= */
//     const [existing] = await db.query(
//       "SELECT id FROM users WHERE username = ?",
//       [username]
//     );

//     if (existing.length > 0) {
//       return res.status(409).json({
//         success: false,
//         message: "Username already exists",
//       });
//     }

//     /* ================= CREATE USER ================= */
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const myReferralCode = generateCode(username);

//     await db.query(
//       `INSERT INTO users (username, password, referral_code)
//        VALUES (?, ?, ?)`,
//       [username, hashedPassword, myReferralCode]
//     );

//     /* ================= REFERRAL ================= */
//     if (referralCode) {
//       const [rows] = await db.query(
//         `SELECT username FROM users WHERE referral_code = ?`,
//         [referralCode]
//       );

//       if (rows.length > 0) {
//         const referrer = rows[0].username;

//         await db.query(
//           `INSERT INTO referrals (referrer_username, referred_username)
//            VALUES (?, ?)`,
//           [referrer, username]
//         );

//         await db.query(
//           `INSERT INTO click_counter (username, clicks_added)
//            VALUES (?, 20)`,
//           [referrer]
//         );
//       }
//     }

//     /* ================= SUCCESS ================= */
//     return res.status(201).json({
//       success: true,
//       message: "User registered successfully",
//     });

//   } catch (error) {
//     console.error("REGISTER ERROR:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// });

// module.exports = router;

router.post("/register", async (req, res) => {
  try {
    const { username, password, referralCode } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const myReferralCode = generateCode(username);

    // 1️⃣ CREATE USER
    db.query(
      "INSERT INTO users (username, password, referral_code) VALUES (?, ?, ?)",
      [username, hashedPassword, myReferralCode],
      (err) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
              success: false,
              message: "Username already exists",
            });
          }

          console.error("Register error:", err);
          return res.status(500).json({ success: false });
        }

        // 2️⃣ HANDLE REFERRAL
        if (referralCode) {
          db.query(
            "SELECT username FROM users WHERE referral_code = ?",
            [referralCode],
            (err, rows) => {
              if (!err && rows.length) {
                const referrer = rows[0].username;

                db.query(
                  "INSERT INTO referrals (referrer_username, referred_username) VALUES (?, ?)",
                  [referrer, username]
                );

                db.query(
                  "INSERT INTO click_counter (username, clicks_added) VALUES (?, 20)",
                  [referrer]
                );
              }
            }
          );
        }

        // ✅ IMPORTANT RESPONSE
        return res.status(201).json({
          success: true,
          message: "Registered successfully",
        });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});



/* LOGIN */
router.post("/login", async (req, res) => {
  try {
    const { Username, password } = req.body;

    if (!Username || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const [rows] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [Username]
    );

    if (!rows.length) {
      return res.status(401).json({ message: "Invalid login" });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid login" });
    }

    req.session.user = {
      id: user.id,
      username: user.username,
    };

    res.json({
      success: true,
      user: req.session.user,
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* LOGOUT */
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("dcoin.sid");
    res.json({ message: "Logged out successfully" });
  });
});

/* GENERATE CODE */
function generateCode(username) {
  return (
    username.slice(0, 3).toUpperCase() +
    Math.random().toString(36).substring(2, 6).toUpperCase()
  );
}

/* REGISTER */
router.post("/register", async (req, res) => {
  try {
    const { username, password, referralCode } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const myReferralCode = generateCode(username);

    db.query(
      "INSERT INTO users (username, password, referral_code) VALUES (?, ?, ?)",
      [username, hashedPassword, myReferralCode],
      (err) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ success: false });
          }
          return res.status(500).json({ success: false });
        }

        // referral logic
        if (referralCode) {
          db.query(
            "SELECT username FROM users WHERE referral_code = ?",
            [referralCode],
            (err, rows) => {
              if (!err && rows.length) {
                const referrer = rows[0].username;

                db.query(
                  "INSERT INTO referrals (referrer_username, referred_username) VALUES (?, ?)",
                  [referrer, username]
                );

                db.query(
                  "INSERT INTO click_counter (username, clicks_added) VALUES (?, 20)",
                  [referrer]
                );
              }
            }
          );
        }

        res.json({
          success: true,
          message: "Registered successfully",
        });
      }
    );
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;