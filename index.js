import express from 'express';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js'

dotenv.config()

//Crear el servidor express
const app = express();

//Directorio Publico  
app.use(express.static('public'));

//Lectura del Body
app.use( express.json() );

//TODO auth:  Crear, Login, renew
app.use('/api/auth', authRoutes);




//TODO CRUD: Eventos 




//Escuchar Peticiones 
app.listen(process.env.PORT, () => {
    console.log(`Servidor Corriendo en el puerto ${process.env.PORT}`)
})
