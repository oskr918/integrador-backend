const jwt = require('jsonwebtoken');

const SECRET_KEY = 'miClaveSecreta';

function validateToken(req, res, next) {
  // Obtener el token del encabezado Authorization
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }
  const token = authHeader.split(' ')[1];

  try {
    // Verificar el token y agregar los datos del usuario a la solicitud
    const decodedToken = jwt.verify(token, SECRET_KEY);
    req.userData = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
}

module.exports = validateToken;
