require("rootpath")();
const express = require('express');
const app = express();
const morgan = require('morgan');
const config = require('./src/config/config.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(morgan('tiny'));
morgan(':method :url :status :res[content-length] - :response-time ms');

const cursoCont = require("./src/controller/cursoController.js");
app.use(cursoCont);

// const cursoCont = require("./src/controller/cursoController.js");
// app.use("/api/curso", cursoCont);


app.listen(config.server.port, function (err) {
   if (err) {
      console.log(err);
   }else{
      console.log(`Server en escucha en el Puerto: ${config.server.port}`);
   }
})