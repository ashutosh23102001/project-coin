



// // =======================
// // SAVE CLICK DATA (PROTECTED)
// // =======================
// app.post("/saveClickData", (req, res) => {
//   if (!req.session.user) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   const { clicks_added } = req.body;
//   const username = req.session.user.username;

//   if (typeof clicks_added !== "number") {
//     return res.status(400).json({ message: "Invalid clicks" });
//   }

//   const sql =
//     "INSERT INTO click_counter (username, clicks_added) VALUES (?, ?)";

//   db.query(sql, [username, clicks_added], (err) => {
//     if (err) {
//       console.error("DB Error:", err);
//       return res.status(500).json({ message: "DB Error" });
//     }

//     res.json({ message: "Clicks saved successfully" });
//   });
// });


// const express = require("express");
// const db = require("../db"); // ✅ correct relative path

// const router = express.Router();

// // =======================
// // SAVE CLICK DATA (PROTECTED)
// // =======================
// router.post("/saveClickData", (req, res) => {
//   if (!req.session || !req.session.user) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   const { clicks_added } = req.body;
//   const username = req.session.user.username;

//   if (typeof clicks_added !== "number") {
//     return res.status(400).json({ message: "Invalid clicks" });
//   }

//   const sql =
//     "INSERT INTO click_counter (username, clicks_added) VALUES (?, ?)";

//   db.query(sql, [username, clicks_added], (err) => {
//     if (err) {
//       console.error("DB Error:", err);
//       return res.status(500).json({ message: "DB Error" });
//     }

//     res.json({ message: "Clicks saved successfully" });
//   });
// });

// module.exports = router;

// const express = require("express");
// const db = require("../db");

// const router = express.Router();

// /* =======================
//    SAVE CLICK DATA (PROTECTED)
// ======================= */
// router.post("/saveClickData", (req, res) => {
//   if (!req.session || !req.session.user) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   const { clicks_added } = req.body;
//   const username = req.session.user.username;

//   if (typeof clicks_added !== "number") {
//     return res.status(400).json({ message: "Invalid clicks" });
//   }

//   const sql =
//     "INSERT INTO click_counter (username, clicks_added) VALUES (?, ?)";

//   db.query(sql, [username, clicks_added], (err) => {
//     if (err) {
//       console.error("DB Error:", err);
//       return res.status(500).json({ message: "DB Error" });
//     }

//     res.json({ message: "Clicks saved successfully" });
//   });
// });

// module.exports = router;
const express = require("express");
const db = require("../db");

const router = express.Router();

router.post("/saveClickData", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { clicks_added } = req.body;

  if (typeof clicks_added !== "number") {
    return res.status(400).json({ message: "Invalid clicks" });
  }

  db.query(
    "INSERT INTO click_counter (username, clicks_added) VALUES (?, ?)",
    [req.session.user.username, clicks_added],
    (err) => {
      if (err) return res.status(500).json({ message: "DB Error" });
      res.json({ message: "Clicks saved successfully" });
    }
  );
});

module.exports = router;
