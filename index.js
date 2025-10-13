import express from 'express';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js'
import { dbConection } from './database/config.js';
import  cors  from 'cors'

import eventsRoute from './routes/events.js'

dotenv.config()

//Crear el servidor express
const app = express();

//Base de Datos 
dbConection()

//CORS
app.use(cors())

//Directorio Publico  
app.use(express.static('public'));

//Lectura del Body
app.use( express.json() );

//TODO auth:  Crear, Login, renew
app.use('/api/auth', authRoutes);

//TODO CRUD: Eventos 
app.use('/api/events', eventsRoute);



//Escuchar Peticiones 
app.listen(process.env.PORT, () => {
    console.log(`Servidor Corriendo en el puerto ${process.env.PORT}`)
})
