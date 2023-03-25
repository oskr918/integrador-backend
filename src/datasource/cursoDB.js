const { query } = require('express');
const mysql = require('mysql');
const config = require("../config/config.json");


// conexion a la DB
var connection = mysql.createConnection(config.database);

connection.connect((err) => {
   if (err) {
      console.log(err);
   } else {
      console.log("DB conectada (curso)...");
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
   connection.query("SELECT alumno.* FROM alumno_curso INNER JOIN alumno ON alumno_curso.id_alumno = alumno.id WHERE alumno_curso.id_curso = ?", id, function (err, result, fields) {
      if (err) {
         funCallBack({
            message: "Surgio unproblema, contactese con un administrador. Gracias!",
            detail: err
         });
         console.error(err);
      } else {
         if (result.length > 0) {
            funCallBack(undefined, result);
         } else {
            funCallBack({
               message: "El Curso no tiene Alumnos aun...",
               detail: "sin alumno"
            })
         }
      };
   });

}

cursoDB.createCurso = function (curso, funCallBack) {
   var query = 'INSERT INTO curso (id, nombre, descripcion, imagen, anio, activo) VALUES (?, ?, ?, ?, ?, ?)';
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
            message: `Se creó el curso ${curso.nombre}`,
            detail: result
         });
      }
   })
}

cursoDB.resgisAlumsCurso = function (data, funCallBack) {

   const { idCurso, idAlumnos } = data;
   var query = "SELECT * FROM alumno_curso WHERE id_curso = ? AND id_alumno IN (?)";
   var params = [idCurso, idAlumnos];
   connection.query(query, params, function (err, result, fields) {

      if (err) {

         console.error(err);
      } else {

         if (result[0] && Object.keys(result[0]).length > 0) {
            funCallBack({
               message: "El/Los alumnos ya estan inscripto en este curso",
               detail: result
            });

         } else {

            var query = "INSERT INTO alumno_curso (id_alumno, id_curso) VALUES ?";
            const valores = idAlumnos.map(idAlumno => [idAlumno, idCurso]);
            
            connection.query(query, [valores], function (err, result, fields) {
               if (err) {
                  console.error(err);
               } else {
                  funCallBack({
                     message: `Se inscribio a los alumnos ${idAlumnos} en el curso ${idCurso}`,
                     detail: result
                  });
               }
            });


         }
      }
   });

}

cursoDB.updateCurso = function (id, curso, funCallBack) {
   var query = 'UPDATE curso SET id = ?, nombre = ?, descripcion = ?, imagen = ?, anio = ?, activo = ? WHERE id = ?'
   var dbParams = [curso.id, curso.nombre, curso.descripcion, curso.imagen, curso.anio, curso.activo, id];
   connection.query(query, dbParams, function (err, result, fields) {
      if (err) {
         funCallBack({
            code: 3,
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
   console.log("borrar curso")
   var query = "DELETE FROM alumno_curso WHERE alumno_curso.id_curso = ?"
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