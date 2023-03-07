const mysql = require('mysql');
const config = require("../config/config.json");

//conectarnos a nuestra DB
var connection = mysql.createConnection(config.database);

connection.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("DB Conectada correctamente (alumno)");
    }
});
//fin de conexion db

var alumnoDB = {};

alumnoDB.getAll = function (funCallback) {
    connection.query("SELECT * FROM alumno", function (err, result, fields) {
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

alumnoDB.getByIdAlumno = function (id, funCallback) {
    connection.query("SELECT * FROM alumno WHERE id=?", id, function (err, result, fields) {
        if (err) {
            funCallback({
                message: "Surgio un problema, contactese con un administrador. Gracias",
                detail: err
            });
            console.error(err);
        } else {
            if (result.length > 0) {
                funCallback(undefined, result[0]);
            } else {
                funCallback({
                    message: "No se encontro el alumno/a"
                });
            }

        }
    });
}

alumnoDB.create = function (alumno, funCallback) {
    var query = 'INSERT INTO alumno (id, nombre, apellido, dni, id_usuario) VALUES (?,?,?,?,?)'
    var dbParams = [alumno.id, alumno.nombre, alumno.apellido, alumno.dni, alumno.id_usuario];
    connection.query(query, dbParams, function (err, result, fields) {
        if (err) {
            if (err.code == 'ER_DUP_ENTRY') {
                funCallback({
                    message: `Ya existe un alumno/a con el id ${alumno.id}`,
                    detail: err
                });
            } else {
                funCallback({
                    message: "Surgio un problema, contactese con un administrador. Gracias",
                    detail: err
                });
            }

            console.error(err);
        } else {
            funCallback(undefined, {
                message: `Se creo el alumno/a ${alumno.apellido} ${alumno.nombre}`,
                detail: result
            });
        }
    });
}

/**
 * 
 * @param {*} id 
 * @param {*} alumno 
 * @param {*} funCallback 
 *         retorna:
 *              code = 1 (EXITO)
 *              code = 2 (NOT FOUND) (NO encontro elemento)
 *              code = 3 (ERROR)
 * 
 */
alumnoDB.update = function (id, alumno, funCallback) {
    var query = 'UPDATE alumno SET id = ? , nombre = ?, apellido = ?,  dni = ?, id_usuario = ? WHERE id = ?'
    var dbParams = [alumno.id, alumno.nombre, alumno.apellido, alumno.dni, alumno.id_usuario, id];
    connection.query(query, dbParams, function (err, result, fields) {
        if (err) {
            funCallback({
                code: 3,
                message: "Surgio un problema, contactese con un administrador. Gracias",
                detail: err
            });
            console.error(err);
        } else {
            if (result.affectedRows == 0) {
                funCallback({
                    code: 2,
                    message: `No se encontro el alumno/a con el id ${id}`,
                    detail: result
                });
            } else {
                funCallback({
                    code: 1,
                    message: `Se modifico el alumno/a  ${alumno.nombre} ${alumno.apellido}`,
                    detail: result
                });
            }
        }
    });

}


alumnoDB.delete = function (id, funCallback) {
    connection.query('DELETE FROM alumno_curso WHERE id_alumno = ?', id, function (err, result, fields) {
        if (err) {
            funCallback({
                message: "Surgio un problema, contactese con un administrador. Gracias",
                detail: err
            });
            console.error(err);
        } else {
            connection.query('DELETE FROM alumno WHERE id = ?', id, function (err, result, fields) {
                if (err) {
                    funCallback({
                        message: "Surgio un problema, contactese con un administrador. Gracias",
                        detail: err
                    });
                    console.error(err);
                } else {
                    if (result.affectedRows == 0) {
                        funCallback(undefined, {
                            message: `No se encontro el alumno/a con el id ${id}`,
                            detail: result
                        });
                    } else {
                        funCallback(undefined, {
                            message: `Se elimino el alumno con el id ${id}`,
                            detail: result
                        });
                    }
                }
            });
        }
    })
}

module.exports = alumnoDB;
