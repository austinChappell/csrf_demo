async function csrfMiddleware(req, res, next) {
  const csrfCookie = req.cookies.csrf_token;
  const csrfToken = req.headers['x-csrf-token'];

  if (csrfCookie === csrfToken) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
}

module.exports = csrfMiddleware;
