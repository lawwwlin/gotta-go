const express = require('express');
const router = express.Router();

module.exports = (db) => {
  //retrieves all user's fave maps in database
  router.get("/:id", (req, res) => {
    const user_id = req.params.id;
    db.query(`SELECT * FROM favourited_maps WHERE user_id = $1;`, [user_id])
      .then(data => {
        const faveMaps = data.rows;
        console.log(`favemaps:`, faveMaps)
        res.json(faveMaps);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  //add map
  router.post("/", (req, res) => {
    const { map_id, pin_id } = req.body;
    db.query(`INSERT INTO favourited_maps (map_id, pin_id) VALUES ($1, $2) RETURNING *;`, [map_id, pin_id])
      .then(data => {
        const mapPins = data.rows[0];
        res
          .json({ mapPins });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message })
      })
  });

  //delete map
  router.delete("/:id", (req, res) => {
    const values = req.params.id;
    db.query(`DELETE FROM favourited_maps WHERE id = $1;`, [values])
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
}
