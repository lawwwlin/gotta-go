-- global password for users is password in bcrypt
ALTER TABLE users
ALTER COLUMN password
SET DEFAULT '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.';

INSERT INTO users (username, location)
VALUES ('vancouver_boy123', point(49.2827, 123.1207)),
('victoria_secret', point(48.42850412297416, -123.36566147114377));
