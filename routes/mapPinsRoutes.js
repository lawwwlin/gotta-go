const express = require('express');
const router = express.Router();

module.exports = (db) => {
  //retrieves all maps in database
  router.get("/:id", (req, res) => {
    //    console.log('/api/mapPins');
    const map_id = req.params.id;
    db.query(`SELECT map_pins.pin_id, pins.creator_id, pins.title, pins.description, pins.image_url, pins.latitude, pins.longitude, map_pins.map_id
      FROM map_pins
      JOIN pins ON pins.id =  pin_id
      WHERE map_id = $1;`, [map_id])
      .then(data => {
        const mapPins = data.rows;
        console.log(mapPins)
        res.json(mapPins);
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
    console.log('post /api/mapPins req.body:', req.body);
    db.query(`INSERT INTO map_pins (map_id, pin_id) VALUES ($1, $2) RETURNING *;`, [map_id, pin_id])
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
    db.query(`DELETE FROM map_pins WHERE id = $1;`, [values])
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
