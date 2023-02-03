create database integrador;

use integrador;

CREATE TABLE usuario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255),
  nickname VARCHAR(50),
  password VARCHAR(50),
  rol VARCHAR(50)
);

CREATE TABLE alumno (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255),
  apellido VARCHAR(255),
  dni VARCHAR(10),
  id_usuario INT,
  FOREIGN KEY (id_usuario) REFERENCES usuario(id)
);

CREATE TABLE curso (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255),
  descripcion VARCHAR(1000),
  imagen VARCHAR(1000),
  anio INT,
  activo BOOLEAN
);

CREATE TABLE alumno_curso (
  id_alumno INT,
  id_curso INT,
  FOREIGN KEY (id_alumno) REFERENCES alumno(id),
  FOREIGN KEY (id_curso) REFERENCES curso(id)
);

INSERT INTO usuario VALUES (1, 'admin@admin.com', 'admin', 'admin','admin');
INSERT INTO usuario VALUES (2, 'docente@docente.com', 'docente', 'docente','docente');
