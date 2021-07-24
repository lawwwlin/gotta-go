-- global password for users is password in bcrypt
ALTER TABLE users
ALTER COLUMN password
SET DEFAULT '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.';

INSERT INTO users (username, location)
VALUES ('vancouver_boy123', (49.2827, 123.1207)),
VALUES ('van_island_lover', (49.6506, 125.4494));
