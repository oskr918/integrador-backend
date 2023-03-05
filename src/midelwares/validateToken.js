const jwt = require('jsonwebtoken');
const config = require('../config/config.json');

const SECRET_KEY = config.secretKey;

function validateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decodedToken = jwt.verify(token, SECRET_KEY);
    req.userData = {
      nickname: decodedToken.nickname,
      rol: decodedToken.rol, // Agregar el rol al objeto userData
    };
   
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
}

module.exports = validateToken;
