const db = require("../db");

/* =========================================
        GET USER BY EMAIL
========================================= */

const getUserByEmail = async (email) => {
  const result = await db.query(
    `
        SELECT

            u.id,

            u.username,

            uv.email

        FROM users u

        INNER JOIN user_verification uv

        ON u.id = uv.user_id

        WHERE uv.email = $1
        `,

    [email],
  );

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
};

/* =========================================
        GET VERIFIED EMAIL
========================================= */

const getVerifiedEmail = async (userId) => {
  const result = await db.query(
    `
        SELECT email

        FROM user_verification

        WHERE user_id = $1
        `,

    [userId],
  );

  return result.rows[0] || null;
};

module.exports = {
  getUserByEmail,

  getVerifiedEmail,
};
