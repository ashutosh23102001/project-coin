
const express = require("express");
const crypto = require("crypto");
const db = require("../db");

const router = express.Router();

/* ======================
   CREATE SHORT LINK
====================== */
router.post("/shorten", (req, res) => {
  const { url, alias } = req.body;

  if (!url) return res.status(400).json({ message: "URL required" });

  const code = alias || crypto.randomBytes(4).toString("hex");

  db.query(
    "SELECT id FROM short_urls WHERE short_code=?",
    [code],
    (err, rows) => {
      if (rows.length > 0) {
        return res.status(409).json({ message: "Alias taken" });
      }

      db.query(
        "INSERT INTO short_urls (original_url, short_code) VALUES (?,?)",
        [url, code],
        () => {
          res.json({
            shortUrl: `http://localhost:5173/ad/${code}` // ✅ OPEN AD PAGE
          });
        }
      );
    }
  );
});

/* ======================
   FINAL REDIRECT
====================== */
router.get("/go/:code", (req, res) => {
  const { code } = req.params;

  db.query(
    "SELECT original_url FROM short_urls WHERE short_code=?",
    [code],
    (err, rows) => {
      if (!rows.length) return res.status(404).send("Not found");

      db.query(
        "UPDATE short_urls SET clicks = clicks + 1 WHERE short_code=?",
        [code]
      );

      res.redirect(rows[0].original_url);
    }
  );
});

module.exports = router;
