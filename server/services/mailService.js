require("dotenv").config();

const nodemailer = require("nodemailer");

/* =========================================
        GMAIL TRANSPORTER
========================================= */
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  requireTLS: true,
});

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);

transporter.verify((err) => {
  if (err) {
    console.error("❌ Gmail Verify Error");
    console.error(err);
  } else {
    console.log("✅ Gmail Server Ready");
  }
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

// const sendMail = async (
//   to,

//   subject,

//   text,
// ) => {
//       console.log("Sending mail to:", to);

//   await transporter.sendMail({
//     from: process.env.EMAIL_USER,

//     to,

//     subject,

//     text,
//   });
//     console.log("Mail sent successfully");

// };

const sendMail = async (to, subject, text) => {

  console.log("MAIL STEP 1");

  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  });

  console.log("MAIL STEP 2");
  console.log(info);

};

module.exports = {
  sendMail,
};
