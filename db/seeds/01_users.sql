-- global password for users is password in bcrypt
ALTER TABLE users
ALTER COLUMN password
SET DEFAULT '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.';

INSERT INTO users (username, latitude, longitude)
VALUES ('vancouver_boy123', 49.2827, -123.1207),             --1
('victoria_secret', 48.42850412297416, -123.36566147114377), --2
('vancity_richmond', 	49.166592, 	-123.133568),              --3
('SFUser', 49.27921170533505, -122.92453038947886),          --4
('UBC_squad', 49.26104100688518, -123.24620129430349),       --5
('Kwanted', 49.1346277502401, -122.8691758339741);           --6
