const runSql = require('../db/runSql');
const setUserMiddleware = require('../middlewares/setUserFromJWT');
const csrfMiddleware = require('../middlewares/csrf');

const router = require('express').Router();

router.post('/', setUserMiddleware, csrfMiddleware, async (req, res) => {
  const rows = await runSql('add_todo', [req.userId, req.body.label]);
  const [todo] = rows;

  res.json(todo);
});

router.get('/', setUserMiddleware, async (req, res) => {
  const todos = await runSql('get_todos', [req.userId]);
  
  res.json(todos);
});

module.exports = router;
