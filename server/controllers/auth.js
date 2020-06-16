const router = require('express').Router();

const bcrypt = require('bcryptjs');
const runSql = require('../db/runSql');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const setUserMiddleware = require('../middlewares/setUserFromJWT');

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

  res.cookie('token', token);
  res.setHeader('x-csrf-token', csrfToken);

  delete user.password;
}

router.get('/me', setUserMiddleware, async (req, res) => {
  const rows = await runSql('get_user_by_id', [req.userId]);

  const [user] = rows;

  if (user) {
    setTokens(user, res);
  
    res.json(user);
  } else {
    res.send(null);
  }
});

router.post('/signup', async (req, res) => {
  const email = req.body.email.trim().toLowerCase();
  const password = hashPassword(req.body.password);

  const rows = await runSql('signup', [email, password]);
  const [user] = rows;

  setTokens(user, res);

  res.json(user);
});

router.post('/login', async (req, res) => {
  const email = req.body.email.trim().toLowerCase();

  const rows = await runSql('get_user_by_email', [email]);
  const [user] = rows;

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isPasswordValid = checkPassword(req.body.password, user.password);

  if (isPasswordValid) {
    setTokens(user, res);
  }

  res.json(user);
});

router.post('/logout', async (req, res) => {
  res.cookie('csrf_token', '', { maxAge: 0 });
  res.cookie('token', '', { maxAge: 0 });

  res.json({ message: 'success' });
});

module.exports = router;
