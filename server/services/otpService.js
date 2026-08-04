require("../db");

const db = require("../db");
const { sendMail } = require("./mailService");

/* =========================================
        GENERATE OTP
========================================= */

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/* =========================================
        SEND OTP
========================================= */

const sendOTP = async (
  email,

  purpose,

  subject,
) => {
  const otp = generateOTP();

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await db.query(
    `
        INSERT INTO email_otps
        (
            email,
            otp,
            purpose,
            verified,
            expires_at
        )

        VALUES

        (
            $1,
            $2,
            $3,
            false,
            $4
        )

        ON CONFLICT
        (
            email,
            purpose
        )

        DO UPDATE SET

        otp = EXCLUDED.otp,

        verified = false,

        expires_at = EXCLUDED.expires_at
        `,

    [email, otp, purpose, expiresAt],
  );

  await sendMail(
    email,

    subject,

    `Your OTP is ${otp}. It will expire in 5 minutes.`,
  );
};

/* =========================================
        VERIFY OTP
========================================= */

const verifyOTP = async (
  email,

  otp,

  purpose,
) => {
  const result = await db.query(
    `
        SELECT *
        FROM email_otps
        WHERE email=$1
        AND purpose=$2
        `,

    [email, purpose],
  );

  if (result.rows.length === 0) {
    return {
      success: false,

      message: "OTP not found.",
    };
  }

  const row = result.rows[0];

  if (new Date() > new Date(row.expires_at)) {
    return {
      success: false,

      message: "OTP expired.",
    };
  }

  if (row.otp !== otp) {
    return {
      success: false,

      message: "Invalid OTP.",
    };
  }

  await db.query(
    `
        UPDATE email_otps

        SET verified=true

        WHERE email=$1

        AND purpose=$2
        `,

    [email, purpose],
  );

  return {
    success: true,

    message: "OTP verified.",
  };
};

/* =========================================
        DELETE OTP
========================================= */

const deleteOTP = async (
  email,

  purpose,
) => {
  await db.query(
    `
        DELETE FROM email_otps

        WHERE email=$1

        AND purpose=$2
        `,

    [email, purpose],
  );
};

/* =========================================
        CHECK VERIFIED
========================================= */

const isVerified = async (
  email,

  purpose,
) => {
  const result = await db.query(
    `
        SELECT verified

        FROM email_otps

        WHERE email=$1

        AND purpose=$2
        `,

    [email, purpose],
  );

  return result.rows.length > 0 && result.rows[0].verified;
};

module.exports = {
  sendOTP,

  verifyOTP,

  deleteOTP,

  isVerified,
};
