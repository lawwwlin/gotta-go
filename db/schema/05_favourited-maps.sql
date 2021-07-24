/* discussion: favourited_maps in users? */
DROP TABLE IF EXISTS favourited_maps CASCADE;
CREATE TABLE favourited_maps (
  id SERIAL PRIMARY KEY NOT NULL,
  map_id INTEGER REFERENCES maps(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);
