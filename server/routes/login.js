

// const express = require("express");
// const bcrypt = require("bcryptjs");
// const db = require("../db"); // ✅ FIX: correct DB import

// const router = express.Router();

// /* ================= LOGIN ================= */
// router.post("/login", async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     console.log("BODY:", req.body);

//     if (!username || !password) {
//       return res.status(400).json({ message: "All fields required" });
//     }

//     /* ✅ FIX: promise query */
//     const [rows] = await db.promise().query(
//       "SELECT * FROM users WHERE username = ?",
//       [username]
//     );

//     if (!rows.length) {
//       return res.status(401).json({ message: "Invalid login" });
//     }

//     const user = rows[0];

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid login" });
//     }

//     /* ✅ FIX: session */
//     req.session.user = {
//       id: user.id,
//       username: user.username,
//     };

//     res.json({
//       success: true,
//       user: req.session.user,
//     });

//   } catch (err) {
//     console.error("LOGIN ERROR:", err);

//     res.status(500).json({
//       message: "Server error",
//     });
//   }
// });

// /* ================= LOGOUT ================= */
// router.post("/logout", (req, res) => {
//   req.session.destroy(() => {
//     res.clearCookie("dcoin.sid");
//     res.json({ message: "Logged out" });
//   });
// });

// module.exports = router;








// /* GENERATE CODE */
// function generateCode(username) {
//   return (
//     username.slice(0, 3).toUpperCase() +
//     Math.random().toString(36).substring(2, 6).toUpperCase()
//   );
// }

// /* REGISTER */
// router.post("/register", async (req, res) => {
//   try {
//     const { username, password, referralCode } = req.body;

//     if (!username || !password) {
//       return res.status(400).json({ success: false });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const generateReferralCode = generateCode(username);

//     db.query(
//       "INSERT INTO users (username, password, referral_code) VALUES (?, ?, ?)",
//       [username, hashedPassword, generateReferralCode],
//       (err) => {
//         if (err) {
//           if (err.code === "ER_DUP_ENTRY") {
//             return res.status(409).json({ success: false });
//           }
//           return res.status(500).json({ success: false });
//         }

//         // referral logic
//         if (referralCode) {
//           db.query(
//             "SELECT username FROM users WHERE referral_code = ?",
//             [referralCode],
//             (err, rows) => {
//               if (!err && rows.length) {
//                 const referrer = rows[0].username;

//                 db.query(
//                   "INSERT INTO referrals (referrer_username, referred_username) VALUES (?, ?)",
//                   [referrer, username]
//                 );

//                 db.query(
//                   "INSERT INTO click_counter (username, clicks_added) VALUES (?, 20)",
//                   [referrer]
//                 );
//               }
//             }
//           );
//         }

//         res.json({
//           success: true,
//           message: "Registered successfully",
//         });
//       }
//     );
//   } catch (err) {
//     console.error("REGISTER ERROR:", err);
//     res.status(500).json({ success: false });
//   }
// });

// module.exports = router;



// const express = require("express");
// const bcrypt = require("bcryptjs");
// const db = require("../db");
// const generateReferralCode = require("../utils/generateReferralCode");

// const router = express.Router();

// /* ================= LOGIN ================= */

// router.post("/login", async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     if (!username || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Username and password required",
//       });
//     }

//     const result = await db.query(
//       "SELECT * FROM users WHERE username = $1",
//       [username]
//     );

//     if (result.rows.length === 0) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid username or password",
//       });
//     }

//     const user = result.rows[0];

//     const match = await bcrypt.compare(password, user.password);

//     if (!match) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid username or password",
//       });
//     }

//     req.session.user = {
//       id: user.id,
//       username: user.username,
//     };

//     res.json({
//       success: true,
//       user: req.session.user,
//     });

//   } catch (err) {
//     console.error(err);

//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// });


// /* ================= REGISTER ================= */

// router.post("/register", async (req, res) => {
//   try {
//     const { username, password, referralCode } = req.body;

//     if (!username || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Username and password required",
//       });
//     }

//     // Check if username already exists
//     const existingUser = await db.query(
//       "SELECT id FROM users WHERE username = $1",
//       [username]
//     );

//     if (existingUser.rows.length > 0) {
//       return res.status(409).json({
//         success: false,
//         message: "Username already exists",
//       });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Generate referral code
// const myReferralCode = generateReferralCode(username);
//     // Insert new user
//     const newUser = await db.query(
//       `
//       INSERT INTO users
//       (
//         username,
//         password,
//         referral_code
//       )
//       VALUES
//       (
//         $1, $2, $3
//       )
//       RETURNING id
//       `,
// [
//     username,
//     hashedPassword,
//     myReferralCode
// ]

//     );

//     // Referral reward
//     if (referralCode) {
//       const referrer = await db.query(
//         `
//         SELECT username
//         FROM users
//         WHERE referral_code = $1
//         `,
//         [referralCode]
//       );

//       if (referrer.rows.length > 0) {
//         const referrerUsername = referrer.rows[0].username;

//         await db.query(
//           `
//           INSERT INTO referrals
//           (
//             referrer_username,
//             referred_username
//           )
//           VALUES
//           (
//             $1, $2
//           )
//           `,
//           [referrerUsername, username]
//         );

//         await db.query(
//           `
//           INSERT INTO click_counter
//           (
//             username,
//             clicks_added
//           )
//           VALUES
//           (
//             $1, 20
//           )
//           `,
//           [referrerUsername]
//         );
//       }
//     }

//     // Auto login after registration
//     req.session.user = {
//       id: newUser.rows[0].id,
//       username,
//     };

//     res.json({
//       success: true,
//       message: "Registered successfully",
//       user: req.session.user,
//     });

//   } catch (err) {
//     console.error("REGISTER ERROR:", err);

//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// });


// /* ================= LOGOUT ================= */

// router.post("/logout", (req, res) => {

//   req.session.destroy(() => {

//     res.clearCookie("dcoin.sid");

//     res.json({
//       success: true,
//       message: "Logged out",
//     });

//   });

// });

// module.exports = router;


// new postgresql version



const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");
const generateReferralCode = require("../utils/generateReferralCode");

const router = express.Router();

/* =====================================================
   LOGIN
===================================================== */

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // ✅ Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    // ✅ Find user
    const result = await db.query(
      `
      SELECT
        id,
        username,
        password
      FROM users
      WHERE username = $1
      `,
      [username.trim()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    const user = result.rows[0];

    // ✅ Compare bcrypt password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    // ✅ Save session
    req.session.user = {
      id: user.id,
      username: user.username,
    };

    // ✅ Save session before responding
    req.session.save((err) => {
      if (err) {
        console.error("SESSION SAVE ERROR:", err);

        return res.status(500).json({
          success: false,
          message: "Session error",
        });
      }

      return res.json({
        success: true,
        message: "Login successful",
        user: req.session.user,
      });
    });

  } catch (err) {
    console.error("========= Login ERROR =========");
    console.error(err);
    console.error(err.stack);

    res.status(500).json({
        success: false,
        message: err.message,
    });
}
});


/* =====================================================
   REGISTER
===================================================== */

router.post("/register", async (req, res) => {
  try {

    let { username, password, referralCode } = req.body;

    username = username?.trim();
    password = password?.trim();
    referralCode = referralCode?.trim();

    // ✅ Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    if (username.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Username must be at least 3 characters",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // ✅ Username already exists?
    const existingUser = await db.query(
      `
      SELECT id
      FROM users
      WHERE username = $1
      `,
      [username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Username already exists",
      });
    }

    // ✅ Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Generate referral code
    const myReferralCode = generateReferralCode(username);

    // ✅ Insert user
    const insertedUser = await db.query(
      `
      INSERT INTO users
      (
        username,
        password,
        referral_code
      )
      VALUES
      (
        $1,
        $2,
        $3
      )
      RETURNING id, username
      `,
      [
        username,
        hashedPassword,
        myReferralCode,
      ]
    );

    const newUser = insertedUser.rows[0];


    // ✅ Auto Login
    req.session.user = {
      id: newUser.id,
      username: newUser.username,
    };

    req.session.save((err) => {

      if (err) {

        console.error("SESSION SAVE ERROR:", err);

        return res.status(500).json({
          success: false,
          message: "Session error",
        });

      }

      return res.json({
        success: true,
        message: "Registered successfully",
        user: req.session.user,
      });

    });

  } catch (err) {
    console.error("========= REGISTER ERROR =========");
    console.error(err);
    console.error(err.stack);

    res.status(500).json({
        success: false,
        message: err.message,
    });
}
});


/* =====================================================
   LOGOUT
===================================================== */

router.post("/logout", (req, res) => {

  req.session.destroy((err) => {

    if (err) {
      return res.status(500).json({
        success: false,
        message: "Logout failed",
      });
    }

    res.clearCookie("dcoin.sid");

    return res.json({
      success: true,
      message: "Logged out successfully",
    });

  });

});


module.exports = router;