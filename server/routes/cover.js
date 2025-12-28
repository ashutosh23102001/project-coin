
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../db");

const router = express.Router();

// =======================
// MULTER CONFIG
// =======================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/covers";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// =======================
// UPDATE COVER (PROTECTED)
// =======================
router.put("/cover", upload.single("cover"), async (req, res) => {
  try {
    // 🔴 CRITICAL CHECK
    if (!req.session || !req.session.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = req.session.user.id;
    const username = req.session.user.username;

    const coverUrl = `/uploads/covers/${req.file.filename}`;

    const sql = `
      INSERT INTO user_media (user_id, username, cover_pic_url)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        cover_pic_url = VALUES(cover_pic_url),
        updated_at = NOW()
    `;

    await db.query(sql, [userId, username, coverUrl]);

    res.json({ cover_pic_url: coverUrl });
  } catch (err) {
    console.error("COVER ERROR:", err);
    res.status(500).json({ message: "Cover upload failed" });
  }
});

module.exports = router;
