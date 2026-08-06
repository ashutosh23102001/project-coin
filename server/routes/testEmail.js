require("dotenv").config();

const express = require("express");
const { sendMail } = require("../services/mailService");

const router = express.Router();

/* =========================================
        TEST EMAIL
========================================= */

router.get("/test-email", async (req, res) => {
  try {
    console.log("========== TEST EMAIL START ==========");

    console.log("STEP 1 : Calling sendMail()");

    await sendMail(
      "ashutosh23102001@gmail.com",
      "Project Coin Test Email",
      "This is a test email from Project Coin."
    );

    console.log("STEP 2 : Email Sent Successfully");

    return res.json({
      success: true,
      message: "Test email sent successfully.",
    });

  } catch (err) {

    console.log("========== TEST EMAIL ERROR ==========");
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;