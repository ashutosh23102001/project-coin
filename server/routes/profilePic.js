


// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs"); // ⭐ FIX (old image delete optional)
// const db = require("../db");

// const router = express.Router();

// /* =========================
//    MULTER STORAGE CONFIG
// ========================= */

// const storage = multer.diskStorage({

//   destination: (req, file, cb) => {

//     const uploadPath = path.join(__dirname, "../uploads/profile"); // ⭐ FIX SAFE PATH

//     // ⭐ FIX ensure folder exists
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath, { recursive: true });
//     }

//     cb(null, uploadPath);

//   },

//   filename: (req, file, cb) => {

//     const ext = path.extname(file.originalname);

//     const filename = "profile_" + Date.now() + ext;

//     cb(null, filename);

//   }

// });

// const upload = multer({

//   storage,

//   limits: { fileSize: 2 * 1024 * 1024 }, // ⭐ 2MB limit

//   fileFilter: (req, file, cb) => {

//     if (!file.mimetype.startsWith("image/")) {
//       return cb(new Error("Only image files allowed"));
//     }

//     cb(null, true);

//   }

// });

// /* =========================
//    UPLOAD PROFILE PIC
// ========================= */

// router.post("/upload-profile-pic", upload.single("profile"), (req, res) => {

//   try {

//     // ⭐ FIX SESSION CHECK
//     if (!req.session?.user) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     // ⭐ FIX FILE CHECK
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const userId = req.session.user.id;

//     const imageUrl = "/uploads/profile/" + req.file.filename;

//     /* =========================
//        SAVE IMAGE IN DATABASE
//     ========================= */

//     const sql = `
//       INSERT INTO user_media (user_id, profile_pic_url)
//       VALUES (?, ?)
//       ON DUPLICATE KEY UPDATE profile_pic_url = VALUES(profile_pic_url)
//     `;

//     db.query(sql, [userId, imageUrl], (err) => {

//       if (err) {

//         console.error("❌ DB ERROR:", err); // ⭐ DEBUG

//         return res.status(500).json({ message: "Database error" });

//       }

//       res.json({

//         message: "Profile picture uploaded successfully",

//         profile_pic_url: imageUrl

//       });

//     });

//   } catch (error) {

//     console.error("❌ SERVER ERROR:", error); // ⭐ DEBUG

//     res.status(500).json({ message: "Server error" });

//   }

// });

// module.exports = router; 

router.post(
  "/upload-profile-pic",
  upload.single("profile"),
  async (req, res) => {
    try {

      if (!req.session?.user) {
        return res.status(401).json({
          message: "Unauthorized"
        });
      }

      if (!req.file) {
        return res.status(400).json({
          message: "No file uploaded"
        });
      }

      const userId = req.session.user.id;

      const imageUrl =
        "/uploads/profile/" + req.file.filename;

      await db.query(
        `
        INSERT INTO user_media
        (
          user_id,
          profile_pic_url
        )

        VALUES
        (
          $1,$2
        )

        ON CONFLICT(user_id)

        DO UPDATE SET

        profile_pic_url=EXCLUDED.profile_pic_url
        `,
        [
          userId,
          imageUrl
        ]
      );

      res.json({
        success: true,
        message: "Profile picture uploaded successfully",
        profile_pic_url: imageUrl
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({
        message: "Database Error"
      });

    }
  }
);