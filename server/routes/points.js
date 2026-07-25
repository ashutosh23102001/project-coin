
// // const express = require("express");
// // const db = require("../db");
// // const router = express.Router();

// // const POINT_SOURCES = {
// //   coin: {
// //     table: "click_counter",
// //     query: "SUM(clicks_added)",
// //     label: "Coin Game"
// //   }
// // };

// // router.get("/points", (req, res) => {
// //   if (!req.session?.user) {
// //     return res.status(401).json({ message: "Unauthorized" });
// //   }

// //   const username = req.session.user.username;

// //   let selectParts = [];
// //   let values = [];

// //   for (let key in POINT_SOURCES) {
// //     const source = POINT_SOURCES[key];

// //     selectParts.push(`
// //       (SELECT ${source.query} FROM ${source.table} WHERE username = ?) AS ${key}Clicks
// //     `);

// //     values.push(username);
// //   }

// //   const sql = `SELECT ${selectParts.join(", ")}`;

// //   db.query(sql, values, (err, rows) => {
// //     if (err) {
// //       console.error("❌ POINTS ERROR:", err);
// //       return res.status(500).json({ message: "Database error" });
// //     }

// //     const result = rows[0] || {};

// //     let total = 0;
// //     let sources = [];

// //     for (let key in POINT_SOURCES) {
// //       const value = result[`${key}Clicks`] || 0;

// //       sources.push({
// //         key,
// //         label: POINT_SOURCES[key].label,
// //         value
// //       });

// //       total += value;
// //     }

// //     res.json({ sources, total });
// //   });
// // });

// // module.exports = router;

// // postgresql version


// // const express = require("express");
// // const db = require("../db");
// // const auth = require("../middleware/auth");

// // const router = express.Router();

// // /* ================= USER POINTS ================= */

// // router.get("/points", auth, async (req, res) => {

// //   try {

// //     const username = req.session.user.username;

// //     const coinResult = await db.query(
// //       `
// //       SELECT
// //       COALESCE(SUM(clicks_added),0) AS total
// //       FROM click_counter
// //       WHERE username=$1
// //       `,
// //       [username]
// //     );

// //     const linkResult = await db.query(
// //       `
// //       SELECT
// //       COUNT(*)::int AS total
// //       FROM short_urls
// //       WHERE username=$1
// //       `,
// //       [username]
// //     );

// //     const coinPoints = Number(coinResult.rows[0].total);
// //     const linkPoints = Number(linkResult.rows[0].total);

// //     res.json({

// //       coinPoints,

// //       linkPoints,

// //       totalPoints: coinPoints + linkPoints

// //     });

// //   } catch (err) {

// //     console.error(err);

// //     res.status(500).json({
// //       message: "Database Error"
// //     });

// //   }

// // });

// // module.exports = router;

// const express = require("express");
// const db = require("../db");
// const auth = require("../middleware/auth");

// const router = express.Router();

// const POINT_SOURCES = {
//   coin: {
//     table: "click_counter",
//     query: "COALESCE(SUM(clicks_added),0)",
//     label: "Coin Game",
//   },

// //const POINT_SOURCES = {
//   coin: {
//     table: "click_counter",
//     query: "COALESCE(SUM(clicks_added),0)",
//     label: "Coin Game",
//   },

//   links: {
//     table: "short_urls",
//     query: "COUNT(*)",
//     label: "Link Shortener",
//   },

//   typing: {
//     table: "typing_points",
//     query: "COALESCE(SUM(points),0)",
//     label: "Typing Test",
//   },
// // const POINT_SOURCES = {
// //   coin: {
// //     table: "click_counter",
// //     query: "COALESCE(SUM(clicks_added),0)",
// //     label: "Coin Game",
// //   },

// //   links: {
// //     table: "short_urls",
// //     query: "COUNT(*)",
// //     label: "Link Shortener",
// //   },

// //   typing: {
// //     table: "typing_points",
// //     query: "COALESCE(SUM(points),0)",
// //     label: "Typing Test",
// //   },
// // };

// };

// router.get("/points", auth, async (req, res) => {
//   try {

//     const userId = req.session.user.id;

//     let selectParts = [];

//     for (const key in POINT_SOURCES) {
//       const source = POINT_SOURCES[key];

//       selectParts.push(`
//         (
//           SELECT ${source.query}
//           FROM ${source.table}
//           WHERE user_id = $1
//         ) AS "${key}Clicks"
//       `);
//     }

//     const sql = `
//       SELECT
//       ${selectParts.join(",")}
//     `;

//     const { rows } = await db.query(sql, [userId]);

//     const result = rows[0] || {};

//     let total = 0;
//     const sources = [];

//     for (const key in POINT_SOURCES) {

//       const value = Number(result[`${key}Clicks`] || 0);

//       sources.push({
//         key,
//         label: POINT_SOURCES[key].label,
//         value,
//       });

//       total += value;

//     }

//     res.json({
//       sources,
//       total,
//     });

//   } catch (err) {

//     console.error("POINTS ERROR:", err);

//     res.status(500).json({
//       message: "Database Error",
//     });

//   }
// });

// module.exports = router;


// const express = require("express");
// const db = require("../db");
// const auth = require("../middleware/auth");

// const router = express.Router();

// /* ================= POINT SOURCES ================= */

// const POINT_SOURCES = {
//   coin: {
//     table: "click_counter",
//     column: "clicks_added",
//     where: "user_id = $1",
//     label: "Coin Game",
//   },

//   /*
//   link: {
//     table: "short_urls",
//     column: "clicks",
//     where: "user_id = $1",
//     label: "Link Shortener",
//   },
//   */
// };

// /* ================= GET POINTS ================= */

// router.get("/points", auth, async (req, res) => {
//   try {

//     // ===== CORRECTION =====
//     if (!req.session.user) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized",
//       });
//     }

//     const userId = req.session.user.id;

//     const sources = [];
//     let total = 0;

//     for (const [key, source] of Object.entries(POINT_SOURCES)) {

//       const result = await db.query(
//         `
//         SELECT
//           COALESCE(SUM(${source.column}),0) AS total
//         FROM ${source.table}
//         WHERE ${source.where}
//         `,
//         [userId]
//       );

//       const value = Number(result.rows[0].total);

//       sources.push({
//         key,
//         label: source.label,
//         value,
//       });

//       total += value;
//     }

//     return res.json({
//       success: true,
//       sources,
//       total,
//     });

//   } catch (err) {

//     // ===== CORRECTION =====
//     console.error("========== POINTS ERROR ==========");
//     console.error(err);
//     console.error("==================================");

//     return res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// });

// module.exports = router;
const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

/* ================= POINT SOURCES ================= */

const POINT_SOURCES = {
  coin: {
    table: "click_counter",
    column: "clicks_added",
    label: "Coin Game",
  },

  // Uncomment when your short_urls table is ready
  /*
  link: {
    table: "short_urls",
    column: "clicks",
    label: "Link Shortener",
  },
  */
};

/* ================= GET POINTS ================= */

router.get("/points", auth, async (req, res) => {
  try {
    /* ======== CHECK LOGIN ======== */

    if (!req.session || !req.session.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const userId = req.session.user.id;

    const sources = [];
    let total = 0;

    /* ======== FETCH EACH SOURCE ======== */

    for (const [key, source] of Object.entries(POINT_SOURCES)) {
      const sql = `
        SELECT
          COALESCE(SUM(${source.column}), 0) AS total
        FROM ${source.table}
        WHERE user_id = $1
      `;

      const result = await db.query(sql, [userId]);

      const value = Number(result.rows[0].total || 0);

      total += value;

      sources.push({
        key,
        label: source.label,
        value,
      });
    }

    /* ======== RESPONSE ======== */

    return res.status(200).json({
      success: true,
      sources,
      total,
    });

  } catch (err) {

    console.error("========== POINTS ERROR ==========");
    console.error(err);
    console.error("==================================");

    return res.status(500).json({
      success: false,
      message: "Database Error",
      error: err.message,
    });
  }
});

/* ================= CLICK HISTORY ================= */

router.get("/click-history", auth, async (req, res) => {
  try {

    if (!req.session || !req.session.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const userId = req.session.user.id;

    const result = await db.query(
      `
      SELECT
        s_id,
        clicks_added,
        created_at
      FROM click_counter
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [userId]
    );

    return res.status(200).json(result.rows);

  } catch (err) {

    console.error("========== CLICK HISTORY ERROR ==========");
    console.error(err);
    console.error("=========================================");

    return res.status(500).json({
      success: false,
      message: "Database Error",
      error: err.message,
    });
  }
});

module.exports = router;