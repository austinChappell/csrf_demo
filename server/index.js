require('dotenv').config();

console.log('DB: ', process.env.PGDATABASE);

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const runSql = require('./db/runSql');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const setUserMiddleware = require('./middlewares/setUserFromJWT');

const app = express();

const todos = [];

const goodCookie = 'this_is_a_good_cookie';

function hashPassword(password) {
  const salt = bcrypt.genSaltSync(10);
  return password ? bcrypt.hashSync(password, salt) : null;
}

const createTokens = (user) => {
  const tokenLifeInMinutes = 30;

  const csrfToken = uuidv4();

  const token = jwt.sign(
    {
      csrfToken,
      user: {
        email: user.email,
        id: user.id,
      }
    },
    process.env.TOKEN_SECRET,
    { expiresIn: `${tokenLifeInMinutes}m` }
  );

  return {
    csrfToken,
    token,
  };
}

function checkPassword(password, passwordHash) {
  return bcrypt.compareSync(password, passwordHash);
}

function setTokens(user, res) {
  const {
    csrfToken,
    token,
  } = createTokens(user);

  res.cookie('csrf_token', csrfToken);
  res.cookie('token', token);

  res.setHeader('x-csrf-token', csrfToken);

  delete user.password;
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(cors({
  allowedHeaders: ['Content-Type', 'x-csrf-token'],
  credentials: true,
  exposedHeaders: ['x-csrf-token'],
  origin: 'http://www.good.com:3000'
}));

app.post('/todos', (req, res) => {
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

app.get('/todos', (req, res) => {
  res.cookie(
    'csrf_token',
    goodCookie,
  );
  res.setHeader('x-csrf-token', goodCookie);
  res.json(todos);
});

app.get('/me', setUserMiddleware, async (req, res) => {
  const rows = await runSql('get_user_by_id', [req.userId]);

  const [user] = rows;

  if (user) {
    setTokens(user, res);
  
    res.json(user);
  } else {
    res.send(null);
  }
});

app.post('/signup', async (req, res) => {
  const email = req.body.email.trim().toLowerCase();
  const password = hashPassword(req.body.password);

  const rows = await runSql('signup', [email, password]);
  const [user] = rows;

  setTokens(user, res);

  res.json(user);
});

app.post('/login', async (req, res) => {
  const email = req.body.email.trim().toLowerCase();

  const rows = await runSql('get_user_by_email', [email]);
  const [user] = rows;

  const isPasswordValid = checkPassword(req.body.password, user.password);

  if (isPasswordValid) {
    setTokens(user, res);
  }

  res.json(user);
});

app.post('/logout', async (req, res) => {
  res.cookie('csrf_token', '', { maxAge: 0 });
  res.cookie('token', '', { maxAge: 0 });

  res.json({ message: 'success' });
});

app.listen(4000, () => {
  console.log('app running on PORT 4000');
});

