CREATE TABLE todos (
  id serial PRIMARY KEY,
  user_id int REFERENCES users(id),
  label varchar(500) NOT NULL
);
