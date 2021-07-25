const express = require('express');
const router = express.Router();


module.exports = (db) => {

  //edit pins
  router.patch("/:id", (req, res) => {
    const values = req.params.id;
    const { user_id, title, description, latitude, longitude, image } = req.body; //add in user_rating(stretch)

    //only creator can edit
    if (user_id === pins.user_id) {
      db.query(`UPDATE pins SET title = $1, description = $2, latitude = $3, longitude = $4, image = $5 WHERE map_id = $6 RETURNING *;`, [title, description, latitude, longitude, image, values])
        .then(data => {
          const pins = data.rows;
          res.json({ pins })
        })
        .catch(err => {
          res
            .status(500)
            .json({ error: err.message });
        })
    } else {
      res.send('Error: User not Authorized.')
    }
  })

}
