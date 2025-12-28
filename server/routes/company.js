const express = require("express");
const db = require("../db");

const router = express.Router();

/*
=================================
 UPSERT PERSONAL DETAILS (SAFE)
=================================
*/
router.put("/", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = req.session.user.id;
  const username = req.session.user.username;

  const {
  
    first_name = "",
    middle_name = null,
    last_name = "",
    date_of_birth = null,
    gender = null
  } = req.body;

  /* Check if record exists */
  const checkSql = "SELECT user_id FROM users_info WHERE user_id = ?";

  db.query(checkSql, [userId], (err, rows) => {
    if (err) {
      console.error("CHECK ERROR:", err);
      return res.status(500).json({ message: "Database error" });
    }

    /* UPDATE */
    if (rows.length > 0) {
      const updateSql = `
        UPDATE users_info
        SET
          username = ?,
          first_name = ?,
          middle_name = ?,
          last_name = ?,
          date_of_birth = ?,
          gender = ?
        WHERE user_id = ?
      `;

      db.query(
        updateSql,
        [
          username,
          first_name,
          middle_name,
          last_name,
          date_of_birth,
          gender,
          userId,
          
        ],
        (err) => {
          if (err) {
            console.error("UPDATE ERROR:", err);
            return res.status(500).json({ message: "Update failed" });
          }

          return res.json({
            message: "Personal details updated successfully"
          });
        }
      );
    }

    /* INSERT */
    else {
      const insertSql = `
        INSERT INTO users_info
        (user_id, username, first_name, middle_name, last_name, date_of_birth, gender)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(
        insertSql,
        [
          userId,
          username,
          first_name,
          middle_name,
          last_name,
          date_of_birth,
          gender
        ],
        (err) => {
          if (err) {
            console.error("INSERT ERROR:", err);
            return res.status(500).json({ message: "Insert failed" });
          }

          return res.json({
            message: "Personal details saved successfully"
          });
        }
      );
    }
  });
});

module.exports = router;
