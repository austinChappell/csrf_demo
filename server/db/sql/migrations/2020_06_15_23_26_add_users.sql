CREATE TABLE users (
  id serial PRIMARY KEY,
  email varchar(200) NOT NULL UNIQUE,
  password varchar(500) NOT NULL
);
