


// const express = require("express");
// const db = require("../db");
// const auth = require("../middleware/auth");

// const router = express.Router();

// /* ================= GET PERSONAL ================= */

// router.get("/", auth, async (req, res) => {
//   try {
//     const result = await db.query(
//       `SELECT
//         username,
//         first_name,
//         middle_name,
//         last_name,
//         date_of_birth,
//         gender
//       FROM users_info
//       WHERE user_id = $1`,
//       [req.session.user.id]
//     );

//     res.json(result.rows[0] || {});
//   } catch (err) {
//     console.error(err);

//     res.status(500).json({
//       message: "Database Error",
//     });
//   }
// });

// /* ================= SAVE PERSONAL ================= */

// router.put("/", auth, async (req, res) => {
//   try {
//     const {
//       first_name,
//       middle_name,
//       last_name,
//       date_of_birth,
//       gender,
//     } = req.body;

//     await db.query(
//       `
//       INSERT INTO users_info
//       (
//         user_id,
//         username,
//         first_name,
//         middle_name,
//         last_name,
//         date_of_birth,
//         gender
//       )
//       VALUES
//       (
//         $1,$2,$3,$4,$5,$6,$7
//       )

//       ON CONFLICT (user_id)

//       DO UPDATE SET

//       first_name=EXCLUDED.first_name,
//       middle_name=EXCLUDED.middle_name,
//       last_name=EXCLUDED.last_name,
//       date_of_birth=EXCLUDED.date_of_birth,
//       gender=EXCLUDED.gender,
//       updated_at=NOW()
//       `,
//       [
//         req.session.user.id,
//         req.session.user.username,
//         first_name,
//         middle_name,
//         last_name,
//         date_of_birth || null,
//         gender,
//       ]
//     );

//     res.json({
//       success: true,
//       message: "Saved Successfully",
//     });
//   } catch (err) {
//     console.error(err);

//     res.status(500).json({
//       message: "Database Error",
//     });
//   }
// });

// module.exports = router;


const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

/* ================= GET PERSONAL ================= */

router.get("/", auth, async (req, res) => {
  try {

    const result = await db.query(
      `
      SELECT
        username,
        first_name,
        middle_name,
        last_name,

        -- ===================== CORRECTION =====================
        TO_CHAR(date_of_birth,'YYYY-MM-DD') AS date_of_birth,
        -- ======================================================

        gender
      FROM users_info
      WHERE user_id=$1
      `,
      [req.session.user.id]
    );

    res.json(result.rows[0] || {});
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Database Error",
    });
  }
});

/* ================= SAVE PERSONAL ================= */

router.put("/", auth, async (req, res) => {
  try {

    const {
      first_name,
      middle_name,
      last_name,
      date_of_birth,
      gender,
    } = req.body;

    await db.query(
      `
      INSERT INTO users_info
      (
        user_id,
        username,
        first_name,
        middle_name,
        last_name,
        date_of_birth,
        gender
      )
      VALUES
      (
        $1,$2,$3,$4,$5,$6,$7
      )

      ON CONFLICT (user_id)

      DO UPDATE SET

      first_name=EXCLUDED.first_name,
      middle_name=EXCLUDED.middle_name,
      last_name=EXCLUDED.last_name,
      date_of_birth=EXCLUDED.date_of_birth,
      gender=EXCLUDED.gender,
      updated_at=NOW()
      `,
      [
        req.session.user.id,
        req.session.user.username,
        first_name,
        middle_name,
        last_name,
        date_of_birth || null,
        gender,
      ]
    );

    res.json({
      success: true,
      message: "Saved Successfully",
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Database Error",
    });
  }
});

module.exports = router;