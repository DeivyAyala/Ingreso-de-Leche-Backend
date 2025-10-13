

//* Rutas de Ususarios / Auth
//* Host /api/events

import { Router } from 'express';
import { crearIngreso, editarIngreso, eliminarIngreso, getIngresos } from '../controllers/ingreso.js';
import { validarjwt } from '../middlewares/validarjwt.js';


const router = Router();


//Todas las peticiones deben pasar por la validación de token 
router.use( validarjwt )

//Obtener eventos
router.get( '/', validarjwt , getIngresos );

//Crear Un nuevo Evento 
router.post( '/', validarjwt ,crearIngreso );


//Editar  Evento 
router.put( '/:id', validarjwt ,editarIngreso );

//Eliminar Evento
router.delete('/:id', validarjwt ,eliminarIngreso);


export default router;

