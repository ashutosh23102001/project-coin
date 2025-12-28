
// // part 2

// const express = require("express");
// const router = express.Router();
// const db = require("../db");

// // =======================
// // GET PROFILE
// // =======================
// router.get("/", (req, res) => {
//   if (!req.session.user) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   const sql = "SELECT id, username, email FROM users WHERE id=?";
//   db.query(sql, [req.session.user.id], (err, data) => {
//     if (err) return res.status(500).json(err);
//     res.json(data[0]);
//   });
// });

// // =======================
// // UPDATE PROFILE
// // =======================
// router.put("/", (req, res) => {
//   if (!req.session.user) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   const { username, email } = req.body;
//   const userId = req.session.user.id;

//   // 🔴 CHECK UNIQUE USERNAME
//   const checkSql = "SELECT id FROM users WHERE username=? AND id!=?";
//   db.query(checkSql, [username, userId], (err, result) => {
//     if (result.length > 0) {
//       return res.status(409).json({ message: "Username already taken" });
//     }

//     const updateSql = "UPDATE users SET username=?, email=? WHERE id=?";
//     db.query(updateSql, [username, email, userId], (err) => {
//       if (err) return res.status(500).json(err);

//       // 🔴 UPDATE SESSION USERNAME
//       req.session.user.username = username;

//       res.json({ message: "Profile updated successfully" });
//     });
//   });
// });

// module.exports = router;

// //part 2 

// const express = require("express");
// const bcrypt = require("bcryptjs");
// const db = require("../db");

// const router = express.Router();

// // =======================
// // GET ACCOUNT (SESSION)
// // =======================
// router.get("/", (req, res) => {
//   if (!req.session.user) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   const sql = "SELECT id, username FROM users WHERE id=?";
//   db.query(sql, [req.session.user.id], (err, data) => {
//     if (err) return res.status(500).json(err);
//     res.json(data[0]);
//   });
// });

// // =======================
// // UPDATE ACCOUNT
// // =======================
// router.put("/", async (req, res) => {
//   if (!req.session.user) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   const { username, oldPassword, newPassword } = req.body;
//   const userId = req.session.user.id;

//   // 🔎 Fetch current user
//   db.query(
//     "SELECT * FROM users WHERE id=?",
//     [userId],
//     async (err, rows) => {
//       if (err) return res.status(500).json(err);

//       const user = rows[0];

//       // 🔐 Verify old password
//       const isMatch = await bcrypt.compare(oldPassword, user.password);
//       if (!isMatch) {
//         return res.status(400).json({ message: "Old password incorrect" });
//       }

//       // 🔐 Hash new password if provided
//       let hashedPassword = user.password;
//       if (newPassword) {
//         hashedPassword = await bcrypt.hash(newPassword, 10);
//       }

//       // ✅ Update DB
//       db.query(
//         "UPDATE users SET username=?, password=? WHERE id=?",
//         [username || user.username, hashedPassword, userId],
//         () => {
//           // 🔁 Update session username
//           req.session.user.username = username || user.username;

//           res.json({ message: "Password updated successfully" });
//         }
//       );
//     }
//   );
// });


// // =======================
// // UPDATE USERNAME ONLY
// // =======================
// router.put("/username", (req, res) => {
//   if (!req.session.user) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   const { username } = req.body;
//   const userId = req.session.user.id;

//   if (!username) {
//     return res.status(400).json({ message: "Username is required" });
//   }

//   // 🔎 Check uniqueness
//   const checkSql = "SELECT id FROM users WHERE username=?";
//   db.query(checkSql, [username], (err, rows) => {
//     if (err) return res.status(500).json(err);

//     if (rows.length > 0) {
//       return res.status(409).json({ message: "Username not available" });
//     }

//     // ✅ Update username
//     db.query(
//       "UPDATE users SET username=? WHERE id=?",
//       [username, userId],
//       () => {
//         req.session.user.username = username; // update session
//         res.json({ message: "Username updated", username });
//       }
//     );
//   });
// });



// module.exports = router;

const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");

const router = express.Router();

/* ===== GET ACCOUNT ===== */
router.get("/", (req, res) => {
  if (!req.session.user)
    return res.status(401).json({ message: "Unauthorized" });

  db.query(
    "SELECT id, username FROM users WHERE id=?",
    [req.session.user.id],
    (err, rows) => {
      if (err) return res.status(500).json(err);
      res.json(rows[0]);
    }
  );
});

/* ===== UPDATE PASSWORD ===== */
router.put("/", async (req, res) => {
  if (!req.session.user)
    return res.status(401).json({ message: "Unauthorized" });

  const { oldPassword, newPassword } = req.body;
  const userId = req.session.user.id;

  db.query(
    "SELECT * FROM users WHERE id=?",
    [userId],
    async (err, rows) => {
      if (err) return res.status(500).json(err);

      const user = rows[0];
      const match = await bcrypt.compare(oldPassword, user.password);

      if (!match)
        return res.status(400).json({ message: "Old password incorrect" });

      const hashed = newPassword
        ? await bcrypt.hash(newPassword, 10)
        : user.password;

      db.query(
        "UPDATE users SET password=? WHERE id=?",
        [hashed, userId],
        () => res.json({ message: "Password updated successfully" })
      );
    }
  );
});

/* ===== UPDATE USERNAME ===== */
router.put("/username", (req, res) => {
  if (!req.session.user)
    return res.status(401).json({ message: "Unauthorized" });

  const { username } = req.body;
  const userId = req.session.user.id;

  db.query(
    "UPDATE users SET username=? WHERE id=?",
    [username, userId],
    () => {
      req.session.user.username = username;
      res.json({ message: "Username updated", username });
    }
  );
});

module.exports = router;
