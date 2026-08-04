




// require("dotenv").config();

// const express = require("express");
// const nodemailer = require("nodemailer");
// const db = require("../db");
// const auth = require("../middleware/auth");

// const router = express.Router();

// /* =========================
//    GMAIL TRANSPORTER
// ========================= */
// /* =========================
//    GMAIL TRANSPORTER
// ========================= */

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
//   connectionTimeout: 60000,
//   greetingTimeout: 60000,
//   socketTimeout: 60000,
//   tls: {
//     rejectUnauthorized: false,
//   },
// });

// // ======== CORRECTION END ========
// // ======== CORRECTION START ========
// transporter.verify((error, success) => {
//   if (error) {
//     console.error("❌ Gmail Verify Error:");
//     console.error(error);
//   } else {
//     console.log("✅ Gmail Server Ready");
//   }
// });
// // ======== CORRECTION END ========

// /* =========================
//    SEND EMAIL OTP
// ========================= */

// router.post("/send-email-otp", auth, async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email) {
//       return res.status(400).json({
//         success: false,
//         message: "Email is required",
//       });
//     }

//     // ======== CORRECTION START ========
//     // Prevent another user from using an already verified email

//     const existingEmail = await db.query(
//       `
//       SELECT user_id
//       FROM user_verification
//       WHERE email = $1
//       AND user_id <> $2
//       `,
//       [email, req.session.user.id]
//     );

//     if (existingEmail.rows.length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Email is already used by another account.",
//       });
//     }

//     // ======== CORRECTION END ========

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();

//     const expiresAt = new Date(Date.now() + 60 * 1000);

//     await db.query(
//       `
//       INSERT INTO email_otps
//       (
//         email,
//         otp,
//         verified,
//         expires_at
//       )
//       VALUES
//       (
//         $1,
//         $2,
//         false,
//         $3
//       )
//       ON CONFLICT (email)
//       DO UPDATE SET
//         otp = EXCLUDED.otp,
//         verified = false,
//         expires_at = EXCLUDED.expires_at
//       `,
//       [email, otp, expiresAt]
//     );

//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: "Project Coin Email Verification",
//       text: `Your OTP is ${otp}. It is valid for 1 minute.`,
//     });

//     return res.json({
//       success: true,
//       message: "OTP sent successfully",
//     });
//   } catch (err) {
//   console.error("========== SEND OTP ERROR ==========");
//   console.error(err);
//   console.error("Message:", err.message);
//   console.error("Code:", err.code);
//   console.error("Response:", err.response);
//   console.error("Response Code:", err.responseCode);

//   return res.status(500).json({
//     success: false,
//     message: err.message,
//   });
// }
// });

// /* =========================
//    VERIFY EMAIL OTP
// ========================= */
// router.post("/verify-email-otp", auth, async (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     if (!email || !otp) {
//       return res.status(400).json({
//         success: false,
//         message: "Email and OTP are required",
//       });
//     }

//     const result = await db.query(
//       `
//       SELECT *
//       FROM email_otps
//       WHERE email = $1
//       `,
//       [email]
//     );

//     if (result.rows.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "OTP not found",
//       });
//     }

//     const row = result.rows[0];

//     if (row.verified) {
//       return res.json({
//         success: true,
//         message: "Already verified",
//       });
//     }

//     if (new Date() > new Date(row.expires_at)) {
//       return res.status(400).json({
//         success: false,
//         message: "OTP expired",
//       });
//     }

//     if (row.otp !== otp) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid OTP",
//       });
//     }

//     await db.query(
//       `
//       UPDATE email_otps
//       SET verified = true
//       WHERE email = $1
//       `,
//       [email]
//     );

//     // ======== CORRECTION START ========
//     // Save verified email permanently

//     await db.query(
//       `
//       INSERT INTO user_verification
//       (
//         user_id,
//         email
//       )
//       VALUES
//       (
//         $1,
//         $2
//       )
//       ON CONFLICT (user_id)
//       DO UPDATE SET
//         email = EXCLUDED.email,
//         updated_at = CURRENT_TIMESTAMP
//       `,
//       [
//         req.session.user.id,
//         email,
//       ]
//     );

//     // Delete OTP after successful verification

//     await db.query(
//       `
//       DELETE FROM email_otps
//       WHERE email = $1
//       `,
//       [email]
//     );

//     // ======== CORRECTION END ========

//     return res.json({
//       success: true,
//       message: "Email verified successfully",
//     });

//   } catch (err) {

//     console.error("VERIFY OTP ERROR");
//     console.error(err);

//     return res.status(500).json({
//       success: false,
//       message: err.message,
//     });

//   }
// });

// /* =========================
//    GET VERIFIED EMAIL
// ========================= */

// // ======== CORRECTION START ========

// router.get("/get-email", auth, async (req, res) => {

//   try {

//     const result = await db.query(
//       `
//       SELECT email
//       FROM user_verification
//       WHERE user_id = $1
//       `,
//       [req.session.user.id]
//     );

//     return res.json({
//       success: true,
//       email: result.rows[0]?.email || "",
//     });

//   } catch (err) {

//     console.error("GET EMAIL ERROR");
//     console.error(err);

//     return res.status(500).json({
//       success: false,
//       message: err.message,
//     });

//   }

// });

// // ======== CORRECTION END ========

// module.exports = router;



require("dotenv").config();

const express = require("express");
const auth = require("../middleware/auth");
const db = require("../db");

const {

    sendOTP,

    verifyOTP,

    deleteOTP

} = require("../services/otpService");

const router = express.Router();

/* =========================================
        SEND EMAIL OTP
========================================= */

router.post("/send-email-otp", auth, async (req, res) => {

    try {

        const { email } = req.body;

        if (!email) {

            return res.status(400).json({

                success: false,

                message: "Email is required."

            });

        }

        /* Prevent duplicate email */

        const existing = await db.query(

            `
            SELECT user_id

            FROM user_verification

            WHERE email = $1

            AND user_id <> $2
            `,

            [

                email,

                req.session.user.id

            ]

        );

        if (existing.rows.length > 0) {

            return res.status(400).json({

                success: false,

                message: "Email already used."

            });

        }

        await sendOTP(

            email,

            "verification",

            "Project Coin Email Verification"

        );

        return res.json({

            success: true,

            message: "OTP sent successfully."

        });

    }

    catch (err) {

        console.log(err);

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

});


/* =========================================
        VERIFY EMAIL OTP
========================================= */

router.post("/verify-email-otp", auth, async (req, res) => {

    try {

        const {

            email,

            otp

        } = req.body;

        if (!email || !otp) {

            return res.status(400).json({

                success: false,

                message: "Email and OTP are required."

            });

        }

        /* Verify OTP */

        const result = await verifyOTP(

            email,

            otp,

            "verification"

        );

        if (!result.success) {

            return res.status(400).json(result);

        }

        /* Save verified email */

        await db.query(

            `
            INSERT INTO user_verification
            (
                user_id,
                email
            )

            VALUES
            (
                $1,
                $2
            )

            ON CONFLICT (user_id)

            DO UPDATE SET

            email = EXCLUDED.email,

            updated_at = CURRENT_TIMESTAMP
            `,

            [

                req.session.user.id,

                email

            ]

        );

        /* Delete OTP */

        await deleteOTP(

            email,

            "verification"

        );

        return res.json({

            success: true,

            message: "Email verified successfully."

        });

    }

    catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

});
/* =========================================
        GET VERIFIED EMAIL
========================================= */

router.get("/get-email", auth, async (req, res) => {

    try {

        const result = await db.query(

            `
            SELECT email

            FROM user_verification

            WHERE user_id = $1
            `,

            [

                req.session.user.id

            ]

        );

        return res.json({

            success: true,

            email: result.rows[0]?.email || ""

        });

    }

    catch (err) {

        console.error(err);

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

});

module.exports = router;