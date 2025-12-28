const express = require("express");
const multer = require("multer");
const db = require("../db");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  }
});

const upload = multer({ storage });

// =======================
// UPDATE USERS_INFO
// =======================
router.put(
  "/",
  upload.fields([
    { name: "profile_pic", maxCount: 1 },
    { name: "cover_pic", maxCount: 1 }
  ]),
  (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const username = req.session.user.username;
    const {
      first_name,
      middle_name,
      last_name,
      date_of_birth,
      gender,
      email,
      phone_number,
      address
    } = req.body;

    const profilePicUrl = req.files.profile_pic
      ? `/uploads/${req.files.profile_pic[0].filename}`
      : null;

    const coverPicUrl = req.files.cover_pic
      ? `/uploads/${req.files.cover_pic[0].filename}`
      : null;

    const sql = `
      UPDATE users_info SET
        first_name=?, middle_name=?, last_name=?,
        date_of_birth=?, gender=?, email=?,
        phone_number=?, address=?,
        profile_pic_url=COALESCE(?, profile_pic_url),
        cover_pic_url=COALESCE(?, cover_pic_url),
        updated_at=NOW()
      WHERE username=?
    `;

    db.query(
      sql,
      [
        first_name,
        middle_name,
        last_name,
        date_of_birth,
        gender,
        email,
        phone_number,
        address,
        profilePicUrl,
        coverPicUrl,
        username
      ],
      (err) => {
        if (err) return res.status(500).json(err);

        res.json({
          message: "Company details updated",
          data: {
            ...req.body,
            profile_pic_url: profilePicUrl,
            cover_pic_url: coverPicUrl
          }
        });
      }
    );
  }
);

module.exports = router;
