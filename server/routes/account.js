

// const express = require("express");
// const bcrypt = require("bcryptjs");
// const db = require("../db");

// const router = express.Router();

// /* ===== GET ACCOUNT ===== */
// router.get("/", (req, res) => {
//   if (!req.session.user)
//     return res.status(401).json({ message: "Unauthorized" });

//   db.query(
//     "SELECT id, username FROM users WHERE id=?",
//     [req.session.user.id],
//     (err, rows) => {
//       if (err) return res.status(500).json(err);
//       res.json(rows[0]);
//     }
//   );
// });

// /* ===== UPDATE PASSWORD ===== */
// router.put("/", async (req, res) => {
//   if (!req.session.user)
//     return res.status(401).json({ message: "Unauthorized" });

//   const { oldPassword, newPassword } = req.body;
//   const userId = req.session.user.id;

//   db.query(
//     "SELECT * FROM users WHERE id=?",
//     [userId],
//     async (err, rows) => {
//       if (err) return res.status(500).json(err);

//       const user = rows[0];
//       const match = await bcrypt.compare(oldPassword, user.password);

//       if (!match)
//         return res.status(400).json({ message: "Old password incorrect" });

//       const hashed = newPassword
//         ? await bcrypt.hash(newPassword, 10)
//         : user.password;

//       db.query(
//         "UPDATE users SET password=? WHERE id=?",
//         [hashed, userId],
//         () => res.json({ message: "Password updated successfully" })
//       );
//     }
//   );
// });

// /* ===== UPDATE USERNAME ===== */
// router.put("/username", (req, res) => {
//   if (!req.session.user)
//     return res.status(401).json({ message: "Unauthorized" });

//   const { username } = req.body;
//   const userId = req.session.user.id;

//   db.query(
//     "UPDATE users SET username=? WHERE id=?",
//     [username, userId],
//     () => {
//       req.session.user.username = username;
//       res.json({ message: "Username updated", username });
//     }
//   );
// });

// module.exports = router;


const express = require("express");
const bcrypt = require("bcryptjs");

const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

/* ================= GET ACCOUNT ================= */

router.get("/", auth, async (req, res) => {

  try {

    const result = await db.query(
      "SELECT id, username FROM users WHERE id=$1",
      [req.session.user.id]
    );

    res.json(result.rows[0]);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Database Error",
    });

  }

});

/* ================= UPDATE PASSWORD ================= */

router.put("/", auth, async (req, res) => {

  try {

    const { oldPassword, newPassword } = req.body;

    const result = await db.query(
      "SELECT * FROM users WHERE id=$1",
      [req.session.user.id]
    );

    const user = result.rows[0];

    const match = await bcrypt.compare(
      oldPassword,
      user.password
    );

    if (!match) {

      return res.status(400).json({
        message: "Old password incorrect",
      });

    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    await db.query(
      "UPDATE users SET password=$1 WHERE id=$2",
      [
        hashedPassword,
        req.session.user.id,
      ]
    );

    res.json({
      success: true,
      message: "Password Updated",
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Database Error",
    });

  }

});

/* ================= UPDATE USERNAME ================= */

router.put("/username", auth, async (req, res) => {

  try {

    const { username } = req.body;

    await db.query(
      "UPDATE users SET username=$1 WHERE id=$2",
      [
        username,
        req.session.user.id,
      ]
    );

    req.session.user.username = username;

    res.json({
      success: true,
      username,
      message: "Username Updated",
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Database Error",
    });

  }

});

module.exports = router;