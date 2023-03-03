require("rootpath")();
const express = require('express');
const app = express();
const morgan = require('morgan');
const config = require("./src/config/config.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
morgan(':method :url :status :res[content-length] - :response-time ms');

const loginUser = require('./src/controller/authController');

app.post('/api/login', loginUser);

app.get("/", function (req, res) {
    res.send("Bienvenido");
});

const alumnoCont = require("./src/controller/alumnoController.js");
app.use("/api/alumno", alumnoCont);

const cursoCont = require("./src/controller/cursoController.js");
app.use("/api/curso", cursoCont);

const usuarioCont = require("./src/controller/usuarioController.js");
app.use("/api/usuario", usuarioCont);

app.listen(config.server.port, function (err) {
  if (err) {
      console.log(err);
  } else {
      console.log(`Server iniciado en puerto:${config.server.port}`);
  }
});

