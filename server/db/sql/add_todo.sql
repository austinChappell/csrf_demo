INSERT INTO todos
  (user_id, label)
  VALUES ($1, $2)
  RETURNING *;
