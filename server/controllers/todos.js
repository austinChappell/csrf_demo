const router = require('express').Router();

const todos = [];

const goodCookie = 'this_is_a_good_cookie';

router.post('/', (req, res) => {
  const id = Math.floor(Math.random() * 1000000);

  const cookies = req.cookies;

  const hasCookie = cookies.csrf_token === goodCookie;
  const hasHeader = req.headers['x-csrf-token'] === goodCookie;

  console.log({cookies})

  console.log({
    hasCookie,
    hasHeader,
  });

  if (hasCookie && hasHeader) {
    todos.push({
      ...req.body,
      id,
    });
  
    res.json({
      ...req.body,
      id,
    })
  } else {
    res.status(401).json({ error: 'invalid cookie' });
  }

})

router.get('/', (req, res) => {
  res.cookie(
    'csrf_token',
    goodCookie,
  );
  res.setHeader('x-csrf-token', goodCookie);
  res.json(todos);
});

module.exports = router;
