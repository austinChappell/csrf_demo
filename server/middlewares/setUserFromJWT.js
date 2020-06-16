const jwt = require('jsonwebtoken');

async function setUserMiddleware(req, res, next) {
  try {
    const token = req.cookies && req.cookies.token;

    if (token) {
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

      req.userId = decoded.user.id;
    } else {
      delete req.userId;
    }

    next();
  } catch (error) {
    return res.status(500).json(error);
  }
}

module.exports = setUserMiddleware;
