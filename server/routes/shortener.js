const express = require("express");
const crypto = require("crypto");
const db = require("../db");

const router = express.Router();

/* =======================================
      CREATE SHORT LINK
======================================= */

router.post("/shortener/create", async (req, res) => {
  try {
    const { original_url } = req.body;

    const user = req.session?.user;

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!original_url) {
      return res.status(400).json({
        message: "URL required",
      });
    }

    const shortCode = crypto.randomBytes(4).toString("hex");

    await db.query(
      `
            INSERT INTO short_urls
            (
                username,
                original_url,
                short_code,
                clicks
            )
            VALUES ($1,$2,$3,0)
            `,
      [user.username, original_url, shortCode],
    );

    res.json({
      short_url: `${process.env.FRONTEND_URL}/s/${shortCode}`,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

/* =======================================
      HISTORY
======================================= */

router.get("/shortener/history", async (req, res) => {
  try {
    const user = req.session?.user;

    if (!user)
      return res.status(401).json({
        message: "Unauthorized",
      });

    const { rows } = await db.query(
      `
            SELECT
                id,
                original_url,
                short_code,
                clicks

            FROM short_urls

            WHERE username=$1

            ORDER BY id DESC
            `,
      [user.username],
    );

    const history = rows.map((link) => ({
      ...link,

      short_url: `${process.env.FRONTEND_URL}/s/${link.short_code}`,
    }));

    res.json(history);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

/* =======================================
      SHORT LINK
======================================= */

router.get("/s/:code", async (req, res) => {
  try {
    const { code } = req.params;

    const { rows } = await db.query(
      `
            SELECT id

            FROM short_urls

            WHERE short_code=$1
            `,
      [code],
    );

    if (rows.length === 0) {
      return res.status(404).send("Invalid Link");
    }

    res.redirect(`${process.env.FRONTEND_URL}/link-ad?code=${code}`);
  } catch (err) {
    console.log(err);

    res.status(500).send("Server Error");
  }
});

/* =======================================
      GET ORIGINAL URL
======================================= */

router.get("/shortener/:code", async (req, res) => {
  try {
    const { code } = req.params;

    const { rows } = await db.query(
      `
            SELECT
                original_url

            FROM short_urls

            WHERE short_code=$1
            `,
      [code],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Link not found",
      });
    }

    res.json(rows[0]);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

/* =======================================
      CLICK COUNTER
======================================= */

router.post("/shortener/click/:code", async (req, res) => {
  try {
    const { code } = req.params;

    await db.query(
      `
            UPDATE short_urls

            SET clicks = clicks + 1

            WHERE short_code=$1
            `,
      [code],
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;
