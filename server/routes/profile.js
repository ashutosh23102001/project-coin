// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");
// const db = require("../db");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dir = "uploads/profiles";
//     if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });

// const upload = multer({ storage });

// router.put("/profile", upload.single("profile"), async (req, res) => {
//   try {
//     const { user_id, username } = req.body;
//     const profileUrl = `/uploads/profiles/${req.file.filename}`;

//     const sql = `
//       INSERT INTO user_media (user_id, username, profile_pic_url)
//       VALUES (?, ?, ?)
//       ON DUPLICATE KEY UPDATE
//         profile_pic_url = VALUES(profile_pic_url),
//         updated_at = NOW()
//     `;

//     await db.query(sql, [user_id, username, profileUrl]);

//     res.json({ profile_pic_url: profileUrl });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;


const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../db");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    const dir = "uploads/profiles";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

router.put("/profile", upload.single("profile"), async (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: "Unauthorized" });

  const profileUrl = `/uploads/profiles/${req.file.filename}`;

  await db.query(
    `
    INSERT INTO user_media (user_id, username, profile_pic_url)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE
      profile_pic_url=VALUES(profile_pic_url),
      updated_at=NOW()
    `,
    [req.session.user.id, req.session.user.username, profileUrl]
  );

  res.json({ profile_pic_url: profileUrl });
});

module.exports = router;
