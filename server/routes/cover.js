

// const express = require("express");
// const multer = require("multer");
// const path = require("path");

// const db = require("../db");
// const auth = require("../middleware/auth");

// const router = express.Router();

// /* ================= STORAGE ================= */

// const storage = multer.diskStorage({

//     destination(req, file, cb) {

//         cb(null, "uploads/cover/");
//     },

//     filename(req, file, cb) {

//         const ext = path.extname(file.originalname);

//         cb(
//             null,
//             Date.now() + "-" + Math.round(Math.random() * 1E9) + ext
//         );

//     }

// });

// const upload = multer({

//     storage,

//     limits: {

//         fileSize: 5 * 1024 * 1024

//     },

//     fileFilter(req, file, cb) {

//         if (
//             file.mimetype === "image/jpeg" ||
//             file.mimetype === "image/png" ||
//             file.mimetype === "image/webp"
//         ) {

//             cb(null, true);

//         } else {

//             cb(new Error("Only images allowed"));

//         }

//     }

// });

// /* ================= UPLOAD COVER ================= */

// router.post(
//     "/cover",
//     auth,
//     upload.single("cover"),

//     async (req, res) => {

//         try {

//             if (!req.file) {

//                 return res.status(400).json({

//                     message: "No image selected"

//                 });

//             }

//             const imagePath =
//                 "/uploads/cover/" + req.file.filename;

//             await db.query(

//                 `
//                 INSERT INTO user_media
//                 (
//                     user_id,
//                     cover_pic_url
//                 )

//                 VALUES
//                 (
//                     $1,$2
//                 )

//                 ON CONFLICT(user_id)

//                 DO UPDATE SET

//                 cover_pic_url=EXCLUDED.cover_pic_url
//                 `,

//                 [

//                     req.session.user.id,

//                     imagePath

//                 ]

//             );

//             res.json({

//                 success: true,

//                 cover_pic_url: imagePath

//             });

//         }

//         catch (err) {

//             console.error(err);

//             res.status(500).json({

//                 message: "Upload Failed"

//             });

//         }

//     }

// );

// /* ================= GET COVER ================= */

// router.get(
//     "/cover",
//     auth,

//     async (req, res) => {

//         try {

//             const result = await db.query(

//                 `
//                 SELECT cover_pic_url

//                 FROM user_media

//                 WHERE user_id=$1
//                 `,

//                 [

//                     req.session.user.id

//                 ]

//             );

//             res.json(result.rows[0] || {});

//         }

//         catch (err) {

//             console.error(err);

//             res.status(500).json({

//                 message: "Database Error"

//             });

//         }

//     }

// );

// module.exports = router;

const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

/* =====================================================
   STORAGE
===================================================== */

const storage = multer.diskStorage({

  destination(req, file, cb) {

    /* =========================
       ⭐ CORRECTION START
       Create folder automatically
    ========================= */

    const uploadPath = path.join(__dirname, "../uploads/cover");

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);

    /* =========================
       ⭐ CORRECTION END
    ========================= */

  },

  filename(req, file, cb) {

    const ext = path.extname(file.originalname);

    cb(
      null,
      "cover_" + Date.now() + ext
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

      cb(new Error("Only JPG, PNG and WEBP images are allowed"));

    }

  }

});

/* =====================================================
   UPLOAD COVER
===================================================== */

router.post(

  /* =========================
     ⭐ CORRECTION START
     Route name matches frontend
  ========================= */

  "/upload-cover-pic",

  /* =========================
     ⭐ CORRECTION END
  ========================= */

  auth,

  upload.single("cover"),

  async (req, res) => {

    try {

      if (!req.file) {

        return res.status(400).json({
          success: false,
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

        cover_pic_url = EXCLUDED.cover_pic_url
        `,

        [

          req.session.user.id,

          imagePath

        ]

      );

      return res.json({

        success: true,

        message: "Cover uploaded successfully",

        cover_pic_url: imagePath

      });

    }

    catch (err) {

      console.error("UPLOAD COVER ERROR");
      console.error(err);

      return res.status(500).json({

        success: false,

        message: err.message

      });

    }

  }

);

/* =====================================================
   GET COVER
===================================================== */

router.get(

  "/cover",

  auth,

  async (req, res) => {

    try {

      const result = await db.query(

        `
        SELECT cover_pic_url

        FROM user_media

        WHERE user_id = $1
        `,

        [

          req.session.user.id

        ]

      );

      return res.json(

        result.rows[0] || {}

      );

    }

    catch (err) {

      console.error(err);

      return res.status(500).json({

        success: false,

        message: err.message

      });

    }

  }

);

module.exports = router;