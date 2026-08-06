

require("dotenv").config();

const nodemailer = require("nodemailer");

/* =========================================
        GMAIL TRANSPORTER
========================================= */
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
});

/* =========================================
        ENV CHECK
========================================= */

console.log("=====================================");
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);
console.log("=====================================");

/* =========================================
        VERIFY SMTP
========================================= */

transporter.verify((err, success) => {
  if (err) {
    console.log("========== VERIFY ERROR ==========");
    console.error("Message :", err.message);
    console.error("Code    :", err.code);
    console.error("Command :", err.command);
    console.error(err);
  } else {
    console.log("========== VERIFY SUCCESS ==========");
    console.log(success);
    console.log("✅ Gmail Server Ready");
  }
});

/* =========================================
        SEND MAIL
========================================= */

const sendMail = async (to, subject, text) => {
  try {
    console.log("=====================================");
    console.log("MAIL STEP 1");
    console.log("TO      :", to);
    console.log("SUBJECT :", subject);
    console.log("=====================================");

    const info = await transporter.sendMail({
      from: `"Project Coin" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log("=====================================");
    console.log("MAIL STEP 2");
    console.log("SUCCESS");
    console.log(info);
    console.log("=====================================");

    return info;

  } catch (err) {

    console.log("=====================================");
    console.log("MAIL ERROR");
    console.log("=====================================");

    console.error("Message       :", err.message);
    console.error("Code          :", err.code);
    console.error("Command       :", err.command);
    console.error("Response      :", err.response);
    console.error("Response Code :", err.responseCode);
    console.error("Stack:");
    console.error(err);

    throw err;
  }
};

module.exports = {
  sendMail,
};