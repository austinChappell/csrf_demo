const jwt = require('jsonwebtoken');

async function csrfMiddleware(req, res, next) {
  const csrfHeader = req.headers['x-csrf-token'];

  try {
    const token = req.cookies && req.cookies.token;

    if (token) {
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

      const { csrfToken } = decoded;

      if (csrfToken === csrfHeader) {
        return next();
      }
    }

    throw new Error();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
}

module.exports = csrfMiddleware;
