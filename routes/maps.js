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
      .then(data => {
        const maps = data.rows;
        res.json({ maps }) // change to res.render("maps") later on
      })
      .catch(err => {
        res.status(500)
          .json({ error: err.message })
      })
  })

  //get favourited maps
  router.get("/:id/favourited_maps", (req, res) => {
    const values = req.params.id;
    db.query(`SELECT * FROM favourited_maps
      JOIN maps ON maps.id = map_id
      JOIN users ON users.id = users.id
      WHERE user_id = $1;`, [values])
      .then(data => {
        const favorites = data.rows;
        res.json({ favorites }); // change to res.render("favourite_maps") later on
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  //edit map
  router.patch("/:id", (req, res) => {
    const values = req.params.id;
    const { name, area, creator_id } = req.body;
    const query = `UPDATE maps SET name = $1, area = $2 WHERE creator_id = $3 AND maps_id = $4 RETURNING *;`;
    db.query(query, [name, area, creator_id, values])
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


  //add map
  router.post("/:id", (req, res) => {
    const values = req.params.id;
    db.query(`INSERT INTO maps (creator_id, area, name) VALUES ($1, $2, $3) RETURNING *`, [creator_id, area, name])
      .then(data => {
        const maps = data.rows[0];
        res
          .json({ maps });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message })
      })
  })


  //delete map
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



