
// const express = require("express");
// const db = require("../db");

// const router = express.Router();

// /* =========================================
//    💰 GET TOTAL POINTS (LOGGED-IN USER)
// ========================================= */
// router.get("/points", (req, res) => {
//   try {
//     /* 🔐 AUTH CHECK */
//     if (!req.session || !req.session.user) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const username = req.session.user.username;

//     /* 📊 SQL QUERY */
//     const sql = `
//       SELECT 
//         (
//           SELECT COALESCE(SUM(clicks_added), 0)
//           FROM click_counter
//           WHERE username = ?
//         ) AS coin_clicks,

//         (
//           SELECT COALESCE(SUM(clicks), 0)
//           FROM short_urls
//           WHERE username = ?
//         ) AS link_clicks
//     `;

//     /* 🛢️ DB QUERY */
//     db.query(sql, [username, username], (err, rows) => {
//       if (err) {
//         console.error("❌ Points DB error:", err);
//         return res.status(500).json({ message: "Database error" });
//       }

//       /* 🛡️ SAFETY CHECK */
//       if (!rows || rows.length === 0) {
//         return res.json({
//           coinClicks: 0,
//           linkClicks: 0,
//           total: 0
//         });
//       }

//       const coinClicks = Number(rows[0].coin_clicks) || 0;
//       const linkClicks = Number(rows[0].link_clicks) || 0;
//       const total = coinClicks + linkClicks;

//       /* ✅ RESPONSE */
//       res.json({
//         coinClicks,
//         linkClicks,
//         total
//       });
//     });
//   } catch (error) {
//     console.error("❌ Points route crash:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;



//working



// const express = require("express");
// const db = require("../db");
// const router = express.Router();

// /* ================= GET TOTAL CLICKS ================= */
// router.get("/points", (req, res) => {
//   if (!req.session?.user) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   const username = req.session.user.username;

//   const sql = `
//     SELECT SUM(clicks_added) AS total
//     FROM click_counter
//     WHERE username = ?
//   `;

//   db.query(sql, [username], (err, rows) => {
//     if (err) {
//       console.error("❌ POINTS ERROR:", err); // 🔴 DEBUG
//       return res.status(500).json({ message: "Database error" });
//     }

//     res.json({
//       total: rows[0].total || 0
//     });
//   });
// });

// module.exports = router;

//new
const express = require("express");
const db = require("../db");
const router = express.Router();

/* =========================================
   🔥 CONFIG: ADD ALL TABLES HERE
========================================= */
const POINT_SOURCES = {
  coin: {
    table: "click_counter",
    query: "SUM(clicks_added)"
  },
  link: {
    table: "short_urls",
    query: "COUNT(*)"
  }
};

/* ================= GET POINTS ================= */
router.get("/points", (req, res) => {
  if (!req.session?.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const username = req.session.user.username;

  let selectParts = [];
  let values = [];

  for (let key in POINT_SOURCES) {
    const source = POINT_SOURCES[key];

    selectParts.push(`
      (SELECT ${source.query} FROM ${source.table} WHERE username = ?) AS ${key}Clicks
    `);

    values.push(username);
  }

  const sql = `SELECT ${selectParts.join(", ")}`;

  db.query(sql, values, (err, rows) => {
    if (err) {
      console.error("❌ POINTS ERROR:", err);
      return res.status(500).json({ message: "Database error" });
    }

    const result = rows[0] || {};

    let total = 0;
    let response = {};

    for (let key in POINT_SOURCES) {
      const value = result[`${key}Clicks`] || 0;
      response[`${key}Clicks`] = value;
      total += value;
    }

    response.total = total;

    res.json(response);
  });
});

module.exports = router;