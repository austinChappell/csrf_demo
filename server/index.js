const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

const todos = [];

const goodCookie = 'this_is_a_good_cookie';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(cors({
  allowedHeaders: ['Content-Type', 'X-CSRF-TOKEN'],
  credentials: true,
  origin: 'http://localhost:3000'
}));

app.post('/todos', (req, res) => {
  const id = Math.floor(Math.random() * 1000000);

  const cookies = req.cookies;

  const hasCookie = cookies.csrf_cookie === goodCookie;
  const hasHeader = req.headers['x-csrf-token'] === goodCookie;

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

app.get('/todos', (req, res) => {
  res.cookie('csrf_cookie', goodCookie);
  res.json(todos);
})

app.listen(4000, () => {
  console.log('app running on PORT 4000');
});
