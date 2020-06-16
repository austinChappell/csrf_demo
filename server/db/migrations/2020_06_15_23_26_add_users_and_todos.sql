CREATE TABLE users (
  id serial PRIMARY KEY,
  email varchar(200) NOT NULL UNIQUE,
  password varchar(500) NOT NULL
);

CREATE TABLE todos (
  id serial PRIMARY KEY,
  user_id int REFERENCES users(id),
  label varchar(500) NOT NULL
);
