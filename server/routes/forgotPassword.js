// const express = require("express");
// const bcrypt = require("bcryptjs");
// const db = require("../db");

// const router = express.Router();

// /* ========= GET EMAIL BY USERNAME ========= */
// router.post("/forgot-password/get-email", (req, res) => {
//   const { username } = req.body;

//   db.query(
//     `SELECT ui.email
//      FROM users u
//      JOIN users_info ui ON u.id = ui.user_id
//      WHERE u.username = ?`,
//     [username],
//     (err, rows) => {
//       if (err) return res.status(500).json({ message: "DB error" });
//       if (!rows.length || !rows[0].email)
//         return res.status(404).json({ message: "Email not found , Contact to customer support" });

//       res.json({ email: rows[0].email });
//     }
//   );
// });

// /* ========= VERIFY OTP (NO SESSION) ========= */
// router.post("/forgot-password/verify-otp", (req, res) => {
//   const { email, otp } = req.body;

//   db.query(
//     `SELECT * FROM email_otps
//      WHERE email=? AND otp=? AND verified=0
//      ORDER BY created_at DESC LIMIT 1`,
//     [email, otp],
//     (err, rows) => {
//       if (err) return res.status(500).json({ message: "DB error" });
//       if (!rows.length)
//         return res.status(400).json({ message: "Invalid OTP" });

//       if (new Date(rows[0].expires_at) < new Date())
//         return res.status(400).json({ message: "OTP expired" });

//       db.query(
//         "UPDATE email_otps SET verified=1 WHERE id=?",
//         [rows[0].id]
//       );

//       res.json({ message: "OTP verified" });
//     }
//   );
// });

// /* ========= RESET PASSWORD ========= */
// router.post("/forgot-password/reset", async (req, res) => {
//   const { username, newPassword } = req.body;

//   const hashed = await bcrypt.hash(newPassword, 10);

//   db.query(
//     "UPDATE users SET password=? WHERE username=?",
//     [hashed, username],
//     err => {
//       if (err)
//         return res.status(500).json({ message: "Update failed" });

//       res.json({ message: "Password updated successfully" });
//     }
//   );
// });

// module.exports = router;


// const express = require("express");
// const bcrypt = require("bcryptjs");

// const db = require("../db");

// const router = express.Router();

// /* ================= RESET PASSWORD ================= */

// router.post("/forgot-password", async (req, res) => {

//     try {

//         const {

//             username,

//             newPassword

//         } = req.body;

//         if (!username || !newPassword) {

//             return res.status(400).json({

//                 success: false,

//                 message: "Username and password required"

//             });

//         }

//         const result = await db.query(

//             `
//             SELECT id
//             FROM users
//             WHERE username=$1
//             `,

//             [username]

//         );

//         if (!result.rows.length) {

//             return res.status(404).json({

//                 success: false,

//                 message: "User not found"

//             });

//         }

//         const hashedPassword = await bcrypt.hash(

//             newPassword,

//             10

//         );

//         await db.query(

//             `
//             UPDATE users
//             SET password=$1
//             WHERE username=$2
//             `,

//             [

//                 hashedPassword,

//                 username

//             ]

//         );

//         res.json({

//             success: true,

//             message: "Password updated successfully"

//         });

//     }

//     catch (err) {

//         console.error(err);

//         res.status(500).json({

//             success: false,

//             message: "Server Error"

//         });

//     }

// });

// module.exports = router;


require("dotenv").config();

const express = require("express");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const db = require("../db");

const router = express.Router();

/* =========================================
            GMAIL TRANSPORTER
========================================= */

const transporter = nodemailer.createTransport({

    host: "smtp.gmail.com",

    port: 465,

    secure: true,

    auth: {

        user: process.env.EMAIL_USER,

        pass: process.env.EMAIL_PASS

    },

    tls: {

        rejectUnauthorized: false

    }

});

transporter.verify((err)=>{

    if(err){

        console.log(err);

    }

    else{

        console.log("Gmail Ready");

    }

});

/* =========================================
            SEND OTP
========================================= */

router.post("/forgot-password/send-otp", async (req,res)=>{

    try{

        const { email } = req.body;

        if(!email){

            return res.status(400).json({

                success:false,

                message:"Email is required."

            });

        }

        /* Check Email */

        const user = await db.query(

            `
            SELECT user_id
            FROM user_verification
            WHERE email=$1
            `,

            [email]

        );

        if(user.rows.length===0){

            return res.status(404).json({

                success:false,

                message:"Email not registered."

            });

        }

        const otp = Math.floor(

            100000 + Math.random()*900000

        ).toString();

        const expiresAt = new Date(

            Date.now()+60000

        );

        await db.query(

            `
            INSERT INTO email_otps
            (
                email,
                otp,
                verified,
                expires_at
            )

            VALUES

            (
                $1,
                $2,
                false,
                $3
            )

            ON CONFLICT(email)

            DO UPDATE SET

            otp=EXCLUDED.otp,

            verified=false,

            expires_at=EXCLUDED.expires_at
            `,

            [

                email,

                otp,

                expiresAt

            ]

        );

        await transporter.sendMail({

            from:process.env.EMAIL_USER,

            to:email,

            subject:"Password Reset OTP",

            text:`Your password reset OTP is ${otp}. It expires in 1 minute.`

        });

        return res.json({

            success:true,

            message:"OTP sent successfully."

        });

    }

   catch (err) {

    console.error("========== SEND OTP ERROR ==========");
    console.error(err);
    console.error("Message:", err.message);
    console.error("Stack:", err.stack);

    return res.status(500).json({
        success: false,
        message: err.message,
    });

}

});

/* =========================================
            VERIFY OTP
========================================= */

router.post("/forgot-password/verify-otp", async (req, res) => {

    try {

        const { email, otp } = req.body;

        if (!email || !otp) {

            return res.status(400).json({

                success: false,

                message: "Email and OTP are required."

            });

        }

        const result = await db.query(

            `
            SELECT *
            FROM email_otps
            WHERE email = $1
            `,

            [email]

        );

        if (result.rows.length === 0) {

            return res.status(400).json({

                success: false,

                message: "OTP not found."

            });

        }

        const row = result.rows[0];

        if (new Date() > new Date(row.expires_at)) {

            return res.status(400).json({

                success: false,

                message: "OTP expired."

            });

        }

        if (row.otp !== otp) {

            return res.status(400).json({

                success: false,

                message: "Invalid OTP."

            });

        }

        await db.query(

            `
            UPDATE email_otps
            SET verified = true
            WHERE email = $1
            `,

            [email]

        );

        return res.json({

            success: true,

            message: "OTP verified successfully."

        });

    }

    catch (err) {

        console.log(err);

        return res.status(500).json({

            success: false,

            message: "Server Error"

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

        const otpResult = await db.query(

            `
            SELECT verified
            FROM email_otps
            WHERE email = $1
            `,

            [email]

        );

        if (

            otpResult.rows.length === 0 ||

            otpResult.rows[0].verified === false

        ) {

            return res.status(400).json({

                success: false,

                message: "OTP verification required."

            });

        }

        const user = await db.query(

            `
            SELECT user_id
            FROM user_verification
            WHERE email = $1
            `,

            [email]

        );

        if (user.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "User not found."

            });

        }

        const userId = user.rows[0].user_id;

        const hashedPassword = await bcrypt.hash(

            newPassword,

            10

        );

        await db.query(

            `
            UPDATE users
            SET password = $1
            WHERE id = $2
            `,

            [

                hashedPassword,

                userId

            ]

        );

        await db.query(

            `
            DELETE FROM email_otps
            WHERE email = $1
            `,

            [email]

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

            message: "Server Error"

        });

    }

});
module.exports = router;