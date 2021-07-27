/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();

module.exports = (db) => {
  //retrieve all users
  router.get("/", (req, res) => {
    console.log('/api/users');
    const user_id = req.session.user_id;
    db.query(`SELECT * FROM users;`)
      .then(data => {
        const users = data.rows;
        res.json({ users, user_id });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  //retrieve user's maps
  router.get("/:id", (req, res) => {
    console.log('/api/users/' + req.params.id);
    const user_id = req.params.id;
    db.query(`SELECT users.*, maps.* FROM users JOIN maps ON creator_id = users.id WHERE creator_id = $1;`, [user_id])
      .then(data => {
        const userData = data.rows;
        res.json({userData});
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  return router;
};

