

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
