const mysql = require('mysql');
const config = require("../config/config.json");


// conexion a la DB
var connection = mysql.createConnection(config.database);

connection.connect((err) => {
   if (err) {
      console.log(err);
   } else {
      console.log("DB conectada...");
   }
});

var cursoDB = {};

cursoDB.getAll = function (funCallBack) {
   connection.query("SELECT * FROM curso", function (err, result, fields) {
      if (err) {
         funCallBack({
            message: "Surgio unproblema, contactese con un administrador. Gracias!",
            detail: err
         });
         console.error(err);
      } else {
         funCallBack(undefined, result);
      }
   });
}

cursoDB.getAlumnosByIdCurso = function (id, funCallBack) {
   connection.query("SELECT * FROM curso WHERE id=?", id, function (err, result, fields) {
      if (err) {
         funCallBack({
            message: "Surgio unproblema, contactese con un administrador. Gracias!",
            detail: err
         });
         console.error(err);
      } else {
         if (result.length > 0) {
            funCallBack(undefined, result[0]);
         } else {
            funCallBack({
               message: "No se encontro el Curso..."
            })
         }
      };
   });
}

cursoDB.createCurso = function (curso, funCallBack) {
   var query = "INSERT INTO curso (id, nombre, descripcion, imagen, anio, activo) VALUES (?, ?, ?, ?, ?, ?)";
   var dbParams = [curso.id, curso.nombre, curso.descripcion, curso.imagen, curso.anio, curso.activo];
   connection.query(query, dbParams, function (err, result, fields) {
      if (err) {
         if (err.code == 'ER_DUP_ENTRY') {
            funCallBack({
               message: `Ya existe un Curso con el id ${curso.id}`,
               detail: err
            });
         } else {
            funCallBack({
               message: 'Surgio un problema, contactese con un administradr. Gracias !!'
            });
         }

         console.error(err);
      } else {
         funCallBack({
            message: `Se ceo el curso ${curso.nombre}`,
            detail: result
         });
      }
   })
}

cursoDB.updateCurso = function (id, curso, funCallBack) {
   var query = "UPDATE curso SET id = ?, nombre = ?, descripcion = ?, imagen = ?, anio = ?, activo = ? WHERE id = ? "
   var dbParams = [curso.id, curso.nombre, curso.descripcion, curso.imagen, curso.anio, curso.activo, id];
   connection.query(query, dbParams, function (err, result, fields) {
      if (err) {
         funCallBack({
            code : 3,
            message: 'Surgio un problema, contactese con un administradr. Gracias !!',
            detail: err
         });
         console.error(err);
      } else {
         if (result.affectedRows == 0) {
            funCallBack({
               code: 2,
               message: `No se encontro el Curso con el id: ${id}`,
               detail: result
            });
         } else {
            funCallBack({
               code: 1,
               message: `Se modifico el Curso con id: ${id}`,
               detail: result
            });
         }
      }
   })
}

cursoDB.deleteCurso = function (id, funCallBack) {
   var query = "DELETE FROM curso WHERE id = ?"
   connection.query(query, id, function (err, result, fields) {
      if (err) {
         funCallBack({
            message: 'Surgio un problema, contactese con un administradr. Gracias !!',
            detail: err
         });
         console.error(err);
      } else {
         if (result.affectedRows == 0) {
            funCallBack(undefined, {
               message: `No se encontro el Curso. id= ${id}`,
               detail: result
            });
         } else {
            funCallBack(undefined, {
               message: `Se Elimino el curso, id = ${id}. Con exito`,
               detail: result
            });
         }         
      }
   });
}


module.exports = cursoDB;