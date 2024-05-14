const jwt = require('jsonwebtoken');
require('dotenv').config();

function autenticarMiddleware(req, res, next) {
  const headerToken = req.header('Authorization');


  if (!headerToken) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  const [bearer, token] = headerToken.split(' ');

  if (bearer !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Formato de token inválido' });
  }

  try {
    const verify = jwt.verify(token, process.env.SECRET);
    req.usuario = verify;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido' });
  }
}

module.exports = autenticarMiddleware;
