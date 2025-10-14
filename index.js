import express from 'express';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js'
import { dbConection } from './database/config.js';
import  cors  from 'cors'

import ingresoRoute from './routes/ingreso.js'
import proveedorRoute from './routes/proveedor.js'

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

//TODO CRUD: Ingresos 
app.use('/api/ingreso', ingresoRoute);

//TODO CRUD: Proveedores 
app.use('/api/proveedor', proveedorRoute )


//Escuchar Peticiones 
app.listen(process.env.PORT, () => {
    console.log(`Servidor Corriendo en el puerto ${process.env.PORT}`)
})
