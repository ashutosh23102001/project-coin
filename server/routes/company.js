// const express = require("express");
// const db = require("../db");

// const router = express.Router();

// /* =============================
//    GET PERSONAL DETAILS
// ============================= */
// router.get("/", (req, res) => {
//   if (!req.session.user) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   const userId = req.session.user.id;

//   db.query(
//     "SELECT first_name, middle_name, last_name, date_of_birth, gender FROM users_info WHERE user_id=?",
//     [userId],
//     (err, rows) => {
//       if (err) return res.status(500).json({ message: "DB error" });
//       res.json(rows[0] || {});
//     }
//   );
// });

// /* =============================
//    UPSERT PERSONAL DETAILS
// ============================= */
// router.put("/", (req, res) => {
//   if (!req.session.user) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   const userId = req.session.user.id;
//   const username = req.session.user.username;

//   const {
//     first_name = "",
//     middle_name = "",
//     last_name = "",
//     date_of_birth = null,
//     gender = ""
//   } = req.body;

//   db.query(
//     "SELECT user_id FROM users_info WHERE user_id=?",
//     [userId],
//     (err, rows) => {
//       if (rows.length > 0) {
//         db.query(
//           `UPDATE users_info SET
//             username=?,
//             first_name=?,
//             middle_name=?,
//             last_name=?,
//             date_of_birth=?,
//             gender=?
//            WHERE user_id=?`,
//           [
//             username,
//             first_name,
//             middle_name,
//             last_name,
//             date_of_birth,
//             gender,
//             userId
//           ],
//           () => res.json({ message: "Updated successfully" })
//         );
//       } else {
//         db.query(
//           `INSERT INTO users_info
//            (user_id, username, first_name, middle_name, last_name, date_of_birth, gender)
//            VALUES (?,?,?,?,?,?,?)`,
//           [
//             userId,
//             username,
//             first_name,
//             middle_name,
//             last_name,
//             date_of_birth,
//             gender
//           ],
//           () => res.json({ message: "Saved successfully" })
//         );
//       }
//     }
//   );
// });

// module.exports = router;


const express = require("express");
const db = require("../db");

const router = express.Router();

/* =============================
   GET PERSONAL DETAILS
============================= */
router.get("/", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = req.session.user.id;

  db.query(
    "SELECT first_name, middle_name, last_name, DATE_FORMAT(date_of_birth,'%Y-%m-%d') AS date_of_birth, gender FROM users_info WHERE user_id=?",
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ message: "DB error" });
      res.json(rows[0] || {});
    }
  );
});

/* =============================
   UPSERT PERSONAL DETAILS
============================= */
router.put("/", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = req.session.user.id;
  const username = req.session.user.username;

  let {
    first_name = "",
    middle_name = "",
    last_name = "",
    date_of_birth = null,
    gender = ""
  } = req.body;

  // 🔒 DOB validation
  if (
    !date_of_birth ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date_of_birth) ||
    new Date(date_of_birth).getFullYear() < 1900
  ) {
    date_of_birth = null;
  }

  db.query(
    "SELECT user_id FROM users_info WHERE user_id=?",
    [userId],
    (err, rows) => {
      if (rows.length > 0) {
        db.query(
          `UPDATE users_info SET
            username=?,
            first_name=?,
            middle_name=?,
            last_name=?,
            date_of_birth=?,
            gender=?
           WHERE user_id=?`,
          [
            username,
            first_name,
            middle_name,
            last_name,
            date_of_birth,
            gender,
            userId
          ],
          () => res.json({ message: "Updated successfully" })
        );
      } else {
        db.query(
          `INSERT INTO users_info
           (user_id, username, first_name, middle_name, last_name, date_of_birth, gender)
           VALUES (?,?,?,?,?,?,?)`,
          [
            userId,
            username,
            first_name,
            middle_name,
            last_name,
            date_of_birth,
            gender
          ],
          () => res.json({ message: "Saved successfully" })
        );
      }
    }
  );
});

module.exports = router;
