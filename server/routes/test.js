const express = require("express");
const { sendMail } = require("../services/mailService");

const router = express.Router();

router.get("/test-email", async (req, res) => {
  try {
    console.log("Starting test email...");

    await sendMail(
      "ashutosh23102001@gmail.com",
      "Project Coin Test Email",
      "Congratulations! This email was sent successfully from your Render server."
    );

    res.json({
      success: true,
      message: "Email sent successfully."
    });
  } catch (err) {
    console.error("TEST EMAIL ERROR");
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;