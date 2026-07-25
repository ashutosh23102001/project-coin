const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

/* =========================
   STORAGE
========================= */

const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    const uploadPath = path.join(__dirname, "../uploads/profile");

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);

  },

  filename: (req, file, cb) => {

    const ext = path.extname(file.originalname);

    cb(null, "profile_" + Date.now() + ext);

  }

});

const upload = multer({

  storage,

  limits: {
    fileSize: 2 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {

    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }

    cb(null, true);

  }

});

/* =========================
   UPLOAD PROFILE
========================= */

router.post(
  "/upload-profile-pic",
  auth,
  upload.single("profile"),
  async (req, res) => {

    try {

      if (!req.file) {
        return res.status(400).json({
          success: false,
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

        ON CONFLICT (user_id)

        DO UPDATE SET

        profile_pic_url = EXCLUDED.profile_pic_url
        `,
        [
          userId,
          imageUrl
        ]
      );

      return res.json({

        success: true,

        message: "Profile picture uploaded successfully",

        profile_pic_url: imageUrl

      });

    } catch (err) {

      console.error(err);

      return res.status(500).json({

        success: false,

        message: err.message

      });

    }

  }
);

module.exports = router;