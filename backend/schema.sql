
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(25) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL CHECK (position('@' IN email) > 1), 
  gender VARCHAR(10),
  birth_year INTEGER,
  phone VARCHAR(15),
  instagram TEXT,
  facebook TEXT,
  country VARCHAR(20),
  languages TEXT,
  profile_img_url TEXT,
  bio TEXT,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE trips (
  id SERIAL PRIMARY KEY,
  date DATE,
  start_location TEXT,
  destination TEXT,
  stops TEXT,
  trip_info TEXT,
  seats INTEGER,
  costs TEXT,
  user_id INTEGER REFERENCES users(id)
);



-- CREATE TABLE routes (
--   id SERIAL PRIMARY KEY,
--   trip_id INTEGER REFERENCES trips(id)
-- );

