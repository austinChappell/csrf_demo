SELECT id, label
  FROM todos
  WHERE user_id = $1;
