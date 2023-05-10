const jwt = require('jsonwebtoken');
const AuthError = require('../utils/errors/auth-err');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AuthError('Необходима авторизация'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, '81409eeb7b60688eff9e7e9b87fd2986878eb85aa851d4bda011e65b635ffe84');
  } catch (err) {
    next(new AuthError('Необходима авторизация'));
  }
  req.user = payload;
  return next();
};
