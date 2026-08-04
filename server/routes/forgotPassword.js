

// require("dotenv").config();

// const express = require("express");
// const bcrypt = require("bcryptjs");
// const nodemailer = require("nodemailer");
// const db = require("../db");

// const router = express.Router();

// /* =========================================
//             GMAIL TRANSPORTER
// ========================================= */
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// transporter.verify((err)=>{

//     if(err){

//         console.log(err);

//     }

//     else{

//         console.log("Gmail Ready");

//     }

// });

// /* =========================================
//             SEND OTP
// ========================================= */

// router.post("/forgot-password/send-otp", async (req,res)=>{

//     try{

//         const { email } = req.body;

//         if(!email){

//             return res.status(400).json({

//                 success:false,

//                 message:"Email is required."

//             });

//         }

//         /* Check Email */

//         const user = await db.query(

//             `
//             SELECT user_id
//             FROM user_verification
//             WHERE email=$1
//             `,

//             [email]

//         );

//         if(user.rows.length===0){

//             return res.status(404).json({

//                 success:false,

//                 message:"Email not registered."

//             });

//         }

//         const otp = Math.floor(

//             100000 + Math.random()*900000

//         ).toString();

//         const expiresAt = new Date(

//             Date.now()+60000

//         );

//         await db.query(

//             `
//             INSERT INTO email_otps
//             (
//                 email,
//                 otp,
//                 verified,
//                 expires_at
//             )

//             VALUES

//             (
//                 $1,
//                 $2,
//                 false,
//                 $3
//             )

//             ON CONFLICT(email)

//             DO UPDATE SET

//             otp=EXCLUDED.otp,

//             verified=false,

//             expires_at=EXCLUDED.expires_at
//             `,

//             [

//                 email,

//                 otp,

//                 expiresAt

//             ]

//         );

//         await transporter.sendMail({

//             from:process.env.EMAIL_USER,

//             to:email,

//             subject:"Password Reset OTP",

//             text:`Your password reset OTP is ${otp}. It expires in 1 minute.`

//         });

//         return res.json({

//             success:true,

//             message:"OTP sent successfully."

//         });

//     }

//    catch (err) {

//     console.error("========== SEND OTP ERROR ==========");
//     console.error(err);
//     console.error("Message:", err.message);
//     console.error("Stack:", err.stack);

//     return res.status(500).json({
//         success: false,
//         message: err.message,
//     });

// }

// });

// /* =========================================
//             VERIFY OTP
// ========================================= */

// router.post("/forgot-password/verify-otp", async (req, res) => {

//     try {

//         const { email, otp } = req.body;

//         if (!email || !otp) {

//             return res.status(400).json({

//                 success: false,

//                 message: "Email and OTP are required."

//             });

//         }

//         const result = await db.query(

//             `
//             SELECT *
//             FROM email_otps
//             WHERE email = $1
//             `,

//             [email]

//         );

//         if (result.rows.length === 0) {

//             return res.status(400).json({

//                 success: false,

//                 message: "OTP not found."

//             });

//         }

//         const row = result.rows[0];

//         if (new Date() > new Date(row.expires_at)) {

//             return res.status(400).json({

//                 success: false,

//                 message: "OTP expired."

//             });

//         }

//         if (row.otp !== otp) {

//             return res.status(400).json({

//                 success: false,

//                 message: "Invalid OTP."

//             });

//         }

//         await db.query(

//             `
//             UPDATE email_otps
//             SET verified = true
//             WHERE email = $1
//             `,

//             [email]

//         );

//         return res.json({

//             success: true,

//             message: "OTP verified successfully."

//         });

//     }

//     catch (err) {

//         console.log(err);

//         return res.status(500).json({

//             success: false,

//             message: "Server Error"

//         });

//     }

// });
// /* =========================================
//         RESET PASSWORD
// ========================================= */

// router.post("/forgot-password/reset-password", async (req, res) => {

//     try {

//         const {

//             email,

//             newPassword

//         } = req.body;

//         if (!email || !newPassword) {

//             return res.status(400).json({

//                 success: false,

//                 message: "Email and password are required."

//             });

//         }

//         const otpResult = await db.query(

//             `
//             SELECT verified
//             FROM email_otps
//             WHERE email = $1
//             `,

//             [email]

//         );

//         if (

//             otpResult.rows.length === 0 ||

//             otpResult.rows[0].verified === false

//         ) {

//             return res.status(400).json({

//                 success: false,

//                 message: "OTP verification required."

//             });

//         }

//         const user = await db.query(

//             `
//             SELECT user_id
//             FROM user_verification
//             WHERE email = $1
//             `,

//             [email]

//         );

//         if (user.rows.length === 0) {

//             return res.status(404).json({

//                 success: false,

//                 message: "User not found."

//             });

//         }

//         const userId = user.rows[0].user_id;

//         const hashedPassword = await bcrypt.hash(

//             newPassword,

//             10

//         );

//         await db.query(

//             `
//             UPDATE users
//             SET password = $1
//             WHERE id = $2
//             `,

//             [

//                 hashedPassword,

//                 userId

//             ]

//         );

//         await db.query(

//             `
//             DELETE FROM email_otps
//             WHERE email = $1
//             `,

//             [email]

//         );

//         return res.json({

//             success: true,

//             message: "Password updated successfully."

//         });

//     }

//     catch (err) {

//         console.log(err);

//         return res.status(500).json({

//             success: false,

//             message: "Server Error"

//         });

//     }

// });
// module.exports = router;

require("dotenv").config();

const express = require("express");
const db = require("../db");

const {

    sendOTP,

    verifyOTP,

    deleteOTP,

    isVerified

} = require("../services/otpService");

const {

    resetPassword

} = require("../services/passwordService");

const router = express.Router();

/* =========================================
        SEND OTP
========================================= */

router.post("/forgot-password/send-otp", async (req, res) => {

    try {

        const { email } = req.body;

        if (!email) {

            return res.status(400).json({

                success: false,

                message: "Email is required."

            });

        }

        /* Check registered email */

        const user = await db.query(

            `
            SELECT user_id

            FROM user_verification

            WHERE email = $1
            `,

            [

                email

            ]

        );

        if (user.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Email not registered."

            });

        }

        await sendOTP(

            email,

            "forgot_password",

            "Project Coin Password Reset"

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
        VERIFY OTP
========================================= */

router.post("/forgot-password/verify-otp", async (req, res) => {

    try {

        const {

            email,

            otp

        } = req.body;

        const result = await verifyOTP(

            email,

            otp,

            "forgot_password"

        );

        if (!result.success) {

            return res.status(400).json(result);

        }

        return res.json({

            success: true,

            message: "OTP verified successfully."

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
        RESET PASSWORD
========================================= */

router.post("/forgot-password/reset-password", async (req, res) => {

    try {

        const {

            email,

            newPassword

        } = req.body;

        if (!email || !newPassword) {

            return res.status(400).json({

                success: false,

                message: "Email and password are required."

            });

        }

        const verified = await isVerified(

            email,

            "forgot_password"

        );

        if (!verified) {

            return res.status(400).json({

                success: false,

                message: "OTP verification required."

            });

        }

        const result = await resetPassword(

            email,

            newPassword

        );

        if (!result.success) {

            return res.status(400).json(result);

        }

        await deleteOTP(

            email,

            "forgot_password"

        );

        return res.json({

            success: true,

            message: "Password updated successfully."

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

module.exports = router;