require("dotenv").config();

const nodemailer = require("nodemailer");

/* =========================================
        GMAIL TRANSPORTER
========================================= */

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

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* =========================================
        VERIFY SMTP
========================================= */

// transporter.verify((err) => {
//   if (err) {
//     console.error("❌ Gmail Verify Error");

//     console.error(err);
//   } else {
//     console.log("✅ Gmail Server Ready");
//   }
// });

/* =========================================
        SEND MAIL
========================================= */

const sendMail = async (
  to,

  subject,

  text,
) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,

    to,

    subject,

    text,
  });
};

module.exports = {
  sendMail,
};
