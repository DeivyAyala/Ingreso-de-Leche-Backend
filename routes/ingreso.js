

//* Rutas de Ususarios / Ingresos
//* Host /api/ingreso

import { Router } from 'express';
import { crearIngreso, editarIngreso, eliminarIngreso, getIngresos } from '../controllers/ingreso.js';
import { validarjwt } from '../middlewares/validarjwt.js';
import { validarCampos } from '../middlewares/validarCampos.js';
import { check } from 'express-validator';


const router = Router();


//Todas las peticiones deben pasar por la validación de token 


//Obtener eventos
router.get(
    '/', 
    getIngresos );

//Crear Un nuevo Evento 
router.use( validarjwt )
router.post( 
    '/', 
    [//Middlewares
        check('volume', 'El volumen de remisión es obligatorio').isFloat({ min: 0 }),
        check('realVolume', 'El volumen real es obligatorio').isFloat({ min: 0 }),
        check('customDate', 'La fecha y hora es obligatoria').isISO8601(), //valida formato de fecha
    ],
    validarCampos,
    crearIngreso );


//Editar  Evento 
router.put( 
    '/:id', 
   [//Middlewares
        check('id', 'No es un ID válido').isMongoId(),
        check('volume').optional().isFloat({ min: 0 }), 
        check('realVolume').optional().isFloat({ min: 0 }),
        check('customDate').optional().isISO8601(), //opcional al editar
    ],
    validarCampos, 
    editarIngreso );

//Eliminar Evento
router.delete(
    '/:id', 
    check('id', 'No es un ID válido').isMongoId(),
    validarCampos, 
    eliminarIngreso);


export default router;






    

    
 