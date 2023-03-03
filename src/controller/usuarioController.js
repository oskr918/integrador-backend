require("rootpath")();
const express = require('express');
const app = express();

const usuarioDB = require("../datasource/usuarioDB.js");


app.get('/:nickname', getUser);

function getUser(req, res) {
    usuarioDB.getUser(req.params.nickname,function (err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(result);
        }
    });
}


module.exports = app;