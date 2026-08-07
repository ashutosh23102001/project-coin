require("dotenv").config();

const nodemailer = require("nodemailer");

console.log("=====================================");
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);
console.log("HOST:", "smtp-relay.brevo.com");
console.log("PORT:", 587);
console.log("=====================================");

/* =========================================
        BREVO SMTP TRANSPORTER
========================================= */

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 2525,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* =========================================
        VERIFY SMTP CONNECTION
========================================= */

console.log("=====================================");
console.log("EMAIL_USER :", process.env.EMAIL_USER);
console.log("EMAIL_PASS :", process.env.EMAIL_PASS ? "Loaded ✅" : "Missing ❌");
console.log("=====================================");

transporter.verify((err, success) => {
  if (err) {
    console.log("========== VERIFY ERROR ==========");
    console.log("Message :", err.message);
    console.log("Code    :", err.code);
    console.log("Command :", err.command);

    if (err.response) {
      console.log("Response :", err.response);
    }

    if (err.responseCode) {
      console.log("Response Code :", err.responseCode);
    }

    console.error(err);
  } else {
    console.log("========== VERIFY SUCCESS ==========");
    console.log(success);
    console.log("✅ Brevo SMTP Ready");
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
    console.log("✅ Mail Sent Successfully");
    console.log("Message ID :", info.messageId);
    console.log("Accepted   :", info.accepted);
    console.log("Rejected   :", info.rejected);
    console.log("Response   :", info.response);
    console.log("=====================================");

    return info;
  } catch (err) {
    console.log("=====================================");
    console.log("❌ SEND MAIL ERROR");
    console.log("Message :", err.message);
    console.log("Code    :", err.code);
    console.log("Command :", err.command);

    if (err.response) {
      console.log("Response :", err.response);
    }

    if (err.responseCode) {
      console.log("Response Code :", err.responseCode);
    }

    console.error(err);
    console.log("=====================================");

    throw err;
  }
};

module.exports = {
  sendMail,
};