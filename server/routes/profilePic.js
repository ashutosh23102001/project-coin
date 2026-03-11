


// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const db = require("../db");

// const router = express.Router();

// /* =========================
//    MULTER CONFIG
// ========================= */
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/profile"); // ✅ folder must exist
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     cb(null, `profile_${Date.now()}${ext}`);
//   }
// });

// const upload = multer({
//   storage,
//   limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
//   fileFilter: (req, file, cb) => {
//     if (!file.mimetype.startsWith("image/")) {
//       return cb(new Error("Only images allowed"));
//     }
//     cb(null, true);
//   }
// });





// /* =========================
//    UPLOAD PROFILE PIC
// ========================= */
// router.post(
//   "/upload-profile-pic",
//   upload.single("profile"),
//   (req, res) => {
//     // ✅ AUTH CHECK
//     if (!req.session || !req.session.user) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     // ✅ FILE CHECK
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const userId = req.session.user.id;
//     const username = req.session.user.username;

//     const imageUrl = `/uploads/profile/${req.file.filename}`;

//     const sql = `
//       INSERT INTO user_media (user_id, username, profile_pic_url)
//       VALUES (?, ?, ?)
//       ON DUPLICATE KEY UPDATE profile_pic_url = VALUES(profile_pic_url)
//     `;

//     db.query(sql, [userId, username, imageUrl], err => {
//       if (err) {
//         console.error("❌ DB error:", err);
//         return res.status(500).json({ message: "Database error" });
//       }

//       res.json({
//         message: "Profile picture updated",
//         profile_pic_url: imageUrl
//       });
//     });
//   }
// );

// module.exports = router;


const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs"); // ⭐ FIX (old image delete optional)
const db = require("../db");

const router = express.Router();

/* =========================
   MULTER STORAGE CONFIG
========================= */

const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    const uploadPath = path.join(__dirname, "../uploads/profile"); // ⭐ FIX SAFE PATH

    // ⭐ FIX ensure folder exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);

  },

  filename: (req, file, cb) => {

    const ext = path.extname(file.originalname);

    const filename = "profile_" + Date.now() + ext;

    cb(null, filename);

  }

});

const upload = multer({

  storage,

  limits: { fileSize: 2 * 1024 * 1024 }, // ⭐ 2MB limit

  fileFilter: (req, file, cb) => {

    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files allowed"));
    }

    cb(null, true);

  }

});

/* =========================
   UPLOAD PROFILE PIC
========================= */

router.post("/upload-profile-pic", upload.single("profile"), (req, res) => {

  try {

    // ⭐ FIX SESSION CHECK
    if (!req.session?.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // ⭐ FIX FILE CHECK
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = req.session.user.id;

    const imageUrl = "/uploads/profile/" + req.file.filename;

    /* =========================
       SAVE IMAGE IN DATABASE
    ========================= */

    const sql = `
      INSERT INTO user_media (user_id, profile_pic_url)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE profile_pic_url = VALUES(profile_pic_url)
    `;

    db.query(sql, [userId, imageUrl], (err) => {

      if (err) {

        console.error("❌ DB ERROR:", err); // ⭐ DEBUG

        return res.status(500).json({ message: "Database error" });

      }

      res.json({

        message: "Profile picture uploaded successfully",

        profile_pic_url: imageUrl

      });

    });

  } catch (error) {

    console.error("❌ SERVER ERROR:", error); // ⭐ DEBUG

    res.status(500).json({ message: "Server error" });

  }

});

module.exports = router;