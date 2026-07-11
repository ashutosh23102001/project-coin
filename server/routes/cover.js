// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");
// const db = require("../db");

// /* ========= MULTER ========= */
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dir = "uploads/cover";
//     if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `cover_${Date.now()}${path.extname(file.originalname)}`);
//   }
// });

// const upload = multer({ storage });

// /* ========= ROUTE ========= */
// router.post("/upload-cover-pic", upload.single("cover"), (req, res) => {
//   if (!req.session.user) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   const { id, username } = req.session.user;
//   const imageUrl = `/uploads/cover/${req.file.filename}`;

//   const sql = `
//     INSERT INTO user_media (user_id, username, cover_pic_url)
//     VALUES (?, ?, ?)
//     ON DUPLICATE KEY UPDATE cover_pic_url = ?
//   `;

//   db.query(sql, [id, username, imageUrl, imageUrl], err => {
//     if (err) return res.status(500).json({ message: "DB error" });

//     req.session.user.cover_pic_url = imageUrl;
//     res.json({ cover_pic_url: imageUrl });
//   });
// });

// module.exports = router;


const express = require("express");
const multer = require("multer");
const path = require("path");

const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

/* ================= STORAGE ================= */

const storage = multer.diskStorage({

    destination(req, file, cb) {

        cb(null, "uploads/cover/");
    },

    filename(req, file, cb) {

        const ext = path.extname(file.originalname);

        cb(
            null,
            Date.now() + "-" + Math.round(Math.random() * 1E9) + ext
        );

    }

});

const upload = multer({

    storage,

    limits: {

        fileSize: 5 * 1024 * 1024

    },

    fileFilter(req, file, cb) {

        if (
            file.mimetype === "image/jpeg" ||
            file.mimetype === "image/png" ||
            file.mimetype === "image/webp"
        ) {

            cb(null, true);

        } else {

            cb(new Error("Only images allowed"));

        }

    }

});

/* ================= UPLOAD COVER ================= */

router.post(
    "/cover",
    auth,
    upload.single("cover"),

    async (req, res) => {

        try {

            if (!req.file) {

                return res.status(400).json({

                    message: "No image selected"

                });

            }

            const imagePath =
                "/uploads/cover/" + req.file.filename;

            await db.query(

                `
                INSERT INTO user_media
                (
                    user_id,
                    cover_pic_url
                )

                VALUES
                (
                    $1,$2
                )

                ON CONFLICT(user_id)

                DO UPDATE SET

                cover_pic_url=EXCLUDED.cover_pic_url
                `,

                [

                    req.session.user.id,

                    imagePath

                ]

            );

            res.json({

                success: true,

                cover_pic_url: imagePath

            });

        }

        catch (err) {

            console.error(err);

            res.status(500).json({

                message: "Upload Failed"

            });

        }

    }

);

/* ================= GET COVER ================= */

router.get(
    "/cover",
    auth,

    async (req, res) => {

        try {

            const result = await db.query(

                `
                SELECT cover_pic_url

                FROM user_media

                WHERE user_id=$1
                `,

                [

                    req.session.user.id

                ]

            );

            res.json(result.rows[0] || {});

        }

        catch (err) {

            console.error(err);

            res.status(500).json({

                message: "Database Error"

            });

        }

    }

);

module.exports = router;