require("rootpath")();
const express = require('express');

const app = express();

const alumnoDB = require("../datasource/alumnoDB.js");
const validateToken = require("../midelwares/validateToken.js");

app.get('/', getAll);

app.get('/:idAlumno', getByIdAlumno);

app.post('/', validateToken, create);

app.put('/:idAlumno', validateToken, update);

app.delete('/:idAlumno', validateToken, eliminar);

// Metodo para listar todas los alumnos

function getAll(req, res) {
    alumnoDB.getAll(function (err, result) {
       if (err) {
          res.status(500).send(err);
       } else {
          res.json(result)
       }
    })
 }
 
// Metodo para buscar a los alumnos por su id

function getByIdAlumno(req, res) {
            alumnoDB.getByIdAlumno(req.params.idAlumno, function (err, result) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.json(result);
                }
            });
        }

// Metodo para agregar alumnos
function create(req, res) {
            alumnoDB.create(req.body, function (err, result) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.json(result);
                }
            });
        }
// Metodo para modificar alumnos
function update(req, res) {
            alumnoDB.update(req.params.idAlumno, req.body, function (result) {
                if (result.code == 3) {
                    res.status(500).send(err);
                } else if (result.code == 2) {
                    res.status(404).json(result);
                } else {
                    res.json(result);
                }
            });
        }

// Metodo para eliminar alumnos 
function eliminar(req, res) {
            alumnoDB.delete(req.params.idAlumno, function (err, result) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    if (result.detail.affectedRows == 0) {
                        res.status(404).json(result);
                    } else {
                        res.json(result);
                    }
                }
            });
        }

module.exports = app;