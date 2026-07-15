

// const express = require("express");
// const db = require("../db");
// const router = express.Router();

// router.post("/saveClickData", (req, res) => {
//   if (!req.session.user) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   const { clicks_added } = req.body;

//   if (typeof clicks_added !== "number") {
//     return res.status(400).json({ message: "Invalid clicks" });
//   }

//   db.query(
//     "INSERT INTO click_counter (username, clicks_added) VALUES (?, ?)",
//     [req.session.user.username, clicks_added],
//     (err) => {
//       if (err) return res.status(500).json({ message: "DB error" });
//       res.json({ message: "Clicks saved" });
//     }
//   );
// });

// module.exports = router;


const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

/* ================= SAVE CLICKS ================= */

router.post("/saveClickData", auth, async (req, res) => {

  try {

    const { clicks } = req.body;

    const username = req.session.user.username;
    const userId = req.session.user.id;

    await db.query(
      `
      INSERT INTO click_counter
      (
       user_id,
        username,
        clicks_added
      )

      VALUES
      (
        $1,$2,$3
      )
      `,
      [
        userId,
        username,
        clicks
      ]
    );

    res.json({

      success: true,

      message: "Clicks Saved"

    });

  } catch (err) {

    console.error(err);

    res.status(500).json({

      message: "Database Error"

    });

  }

});


/* ================= CLICK HISTORY ================= */

router.get("/click-history", auth, async (req, res) => {

  try {

    const result = await db.query(
      `
      SELECT
      id,
      clicks_added,
      created_at
      FROM click_counter
      WHERE username=$1
      ORDER BY created_at DESC
      `,
      [req.session.user.username]
    );

    res.json(result.rows);

  } catch (err) {

    console.error(err);

    res.status(500).json({

      message: "Database Error"

    });

  }

});

module.exports = router;