const express = require("express");
const db = require("../db");

const router = express.Router();

// =======================
// UPDATE ADDRESS DETAILS
// =======================
router.put("/", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const username = req.session.user.username;

  const {
    email,
    phone_number,
    address_line1,
    address_line2,
    city,
    state,
    pincode
  } = req.body;

  const sql = `
    UPDATE users_info SET
      email = ?,
      phone_number = ?,
      address_line1 = ?,
      address_line2 = ?,
      city = ?,
      state = ?,
      pincode = ?,
      updated_at = NOW()
    WHERE username = ?
  `;

  db.query(
    sql,
    [
      email,
      phone_number,
      address_line1,
      address_line2,
      city,
      state,
      pincode,
      username
    ],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({
        message: "Address details updated",
        data: req.body
      });
    }
  );
});

module.exports = router;
