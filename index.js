const express = require('express')
require('dotenv').config()

//Crear el servidor express
const app = express();

//Directorio Publico  
app.use(express.static('public'));

//Lectura del Body
app.use( express.json() );

//TODO auth:  Crear, Login, renew
app.use('/api/auth', require('./routes/auth'));




//TODO CRUD: Eventos 




//Escuchar Peticiones 
app.listen(process.env.PORT, () => {
    console.log(`Servidor Corriendo en el puerto ${process.env.PORT}`)
})
