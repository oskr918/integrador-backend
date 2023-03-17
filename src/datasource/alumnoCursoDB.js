const mysql = require('mysql');
const config = require("../config/config.json");

//conectarnos a nuestra DB
var connection = mysql.createConnection(config.database);

connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("DB Conectada correctamente (alumno_curso)");
    }
});
//fin de conexion db

var alumnoCursoDB = {};

alumnoCursoDB.getAll = function (funCallback) {
    connection.query('SELECT * FROM alumno INNER JOIN curso ON alumno.id > 0 = curso.id > 0', function (err, result, fields) {
        if (err) {
            funCallback({
                message: "Surgio un problema, contactese con un administrador. Gracias",
                detail: err
            });
            console.error(err);
        } else {
            funCallback(undefined, result);
        }
    });
}

module.exports = alumnoCursoDB;