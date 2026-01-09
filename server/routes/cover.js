const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../db");

/* ========= MULTER ========= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/cover";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `cover_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

/* ========= ROUTE ========= */
router.post("/upload-cover-pic", upload.single("cover"), (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id, username } = req.session.user;
  const imageUrl = `/uploads/cover/${req.file.filename}`;

  const sql = `
    INSERT INTO user_media (user_id, username, cover_pic_url)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE cover_pic_url = ?
  `;

  db.query(sql, [id, username, imageUrl, imageUrl], err => {
    if (err) return res.status(500).json({ message: "DB error" });

    req.session.user.cover_pic_url = imageUrl;
    res.json({ cover_pic_url: imageUrl });
  });
});

module.exports = router;
