const express = require('express');
const app = express();
const morgan = require('morgan');
const config = require("./src/config/config.json");
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));

const validateToken = require('./src/midelwares/validateToken.js');
const loginUser = require('./src/controller/authController');
const alumnoCont = require("./src/controller/alumnoController.js");
const cursoCont = require("./src/controller/cursoController.js");
const usuarioCont = require("./src/controller/usuarioController.js");

app.post('/api/login', loginUser);

// Rutas protegidas con validateToken
app.use('/api/alumno', validateToken, alumnoCont);
app.use('/api/curso', validateToken, cursoCont);
app.use('/api/usuario', validateToken, usuarioCont);

app.get("/", function (req, res) {
    res.send("Bienvenido");
});

app.listen(config.server.port, function (err) {
  if (err) {
      console.log(err);
  } else {
      console.log(`Server iniciado en puerto:${config.server.port}`);
  }
});
