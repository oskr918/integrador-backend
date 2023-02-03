const { json } = require('express');
const express = require('express');
const cors = require('cors')
const connection = require('./connect');

const app = express();

app.use(cors());
app.use(json());

app.get('/', (req, res)=>{
    res.send('Bienvenido')
})

 
connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});
 
connection.end();

app.listen(5000, ()=>{
    console.log('Servidor escuchando en el puerto 5000')
})