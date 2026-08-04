const bcrypt = require("bcryptjs");
const db = require("../db");

/* =========================================
        RESET PASSWORD
========================================= */

const resetPassword = async (

    email,

    newPassword

) => {

    /* Find User */

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

    if (

        user.rows.length === 0

    ) {

        return {

            success: false,

            message: "User not found."

        };

    }

    const userId = user.rows[0].user_id;

    /* Hash Password */

    const hashedPassword = await bcrypt.hash(

        newPassword,

        10

    );

    /* Update Password */

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

    return {

        success: true,

        message: "Password updated successfully."

    };

};

module.exports = {

    resetPassword

};