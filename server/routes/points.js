// const express = require("express");
// const db = require("../db");

// const router = express.Router();

// /* =========================================
//    GET TOTAL POINTS (LOGGED IN USER)
// ========================================= */
// router.get("/points", (req, res) => {
//   if (!req.session || !req.session.user) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   const username = req.session.user.username;

//   const sql = `
//     SELECT 
//       (SELECT COALESCE(SUM(clicks_added), 0)
//        FROM click_counter
//        WHERE username = ?) AS coin_clicks,

//       (SELECT COALESCE(SUM(clicks), 0)
//        FROM short_urls) AS link_clicks
//   `;

//   db.query(sql, [username], (err, rows) => {
//     if (err) {
//       console.error("❌ Points error:", err);
//       return res.status(500).json({ message: "DB error" });
//     }

//     const coinClicks = rows[0].coin_clicks;
//     const linkClicks = rows[0].link_clicks;
//     const total = coinClicks + linkClicks;

//     res.json({
//       coinClicks,
//       linkClicks,
//       total
//     });
//   });
// });

// module.exports = router;

const express = require("express");
const db = require("../db");

const router = express.Router();

/* =========================================
   💰 GET TOTAL POINTS (LOGGED-IN USER)
========================================= */
router.get("/points", (req, res) => {
  try {
    /* 🔐 AUTH CHECK */
    if (!req.session || !req.session.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const username = req.session.user.username;

    /* 📊 SQL QUERY */
    const sql = `
      SELECT 
        (
          SELECT COALESCE(SUM(clicks_added), 0)
          FROM click_counter
          WHERE username = ?
        ) AS coin_clicks,

        (
          SELECT COALESCE(SUM(clicks), 0)
          FROM short_urls
          WHERE username = ?
        ) AS link_clicks
    `;

    /* 🛢️ DB QUERY */
    db.query(sql, [username, username], (err, rows) => {
      if (err) {
        console.error("❌ Points DB error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      /* 🛡️ SAFETY CHECK */
      if (!rows || rows.length === 0) {
        return res.json({
          coinClicks: 0,
          linkClicks: 0,
          total: 0
        });
      }

      const coinClicks = Number(rows[0].coin_clicks) || 0;
      const linkClicks = Number(rows[0].link_clicks) || 0;
      const total = coinClicks + linkClicks;

      /* ✅ RESPONSE */
      res.json({
        coinClicks,
        linkClicks,
        total
      });
    });
  } catch (error) {
    console.error("❌ Points route crash:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
