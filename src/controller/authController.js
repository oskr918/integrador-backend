const { getUser } = require('../datasource/usuarioDB');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'miClaveSecreta'; 

function loginUser(req, res) {
  const { nickname, password } = req.body;

  getUser(nickname, (err, user) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Error interno del servidor' });
    } else if (!user) {
      res.status(401).json({ message: 'Usuario no encontrado' });
    } else {
      if (password === user.password) {
        // Generar un token JWT y enviarlo al cliente
        const token = jwt.sign(
          { 
            userId: user.id, 
            nickname: user.nickname, 
            role: user.role // agregar campo role al token
          },
          SECRET_KEY,
          { expiresIn: '1h' }
        );
        res.status(200).json({ token });
      } else {
        res.status(401).json({ message: 'Contraseña incorrecta' });
      }
    }
  });
}

module.exports = loginUser;
