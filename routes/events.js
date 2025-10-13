

//* Rutas de Ususarios / Auth
//* Host /api/events

import { Router } from 'express';
import { crearEvento, editarEvento, eliminarEvento, getEventos } from '../controllers/events.js';
import { validarjwt } from '../middlewares/validarjwt.js';


const router = Router();


//Todas las peticiones deben pasar por la validación de token 
router.use( validarjwt )

//Obtener eventos
router.get( '/', validarjwt , getEventos );

//Crear Un nuevo Evento 
router.post( '/', validarjwt ,crearEvento );


//Editar  Evento 
router.put( '/:id', validarjwt ,editarEvento );

//Eliminar Evento
router.delete('/:id', validarjwt ,eliminarEvento);


export default router;

