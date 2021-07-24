/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

module.exports = (db) => {
  //retrieves all maps in database
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM maps;`)
    .then(data => {
        const maps = data.rows;
        res.json({ maps });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  //retrieves single map via map id
  router.get("/:id", (req, res) => {
    const values = req.params.id;
    db.query(`SELECT * FROM maps WHERE maps.id = $1`, [values])
    .then (data => {
      console.log(data)
      const maps = data.rows;
      res.json({ maps })
    })
    .catch(err => {
      res.status(500)
      .json({ error: err.message })
    })
  })

  router.delete("/:id", (req, res) => {
    const values = req.params.id;
    db.query(`DELETE FROM maps WHERE id = $1`, [values])
      .then(data => {
        res.json({ success: true });
      })
      .catch(err => {
        res
          .status(500)
          .json({ success: false, error: err });
      });
  });

  return router;
};



