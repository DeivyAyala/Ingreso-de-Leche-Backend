

//* Rutas de Ususarios / Ingresos
//* Host /api/ingreso

import { Router } from 'express';
import { crearIngreso, editarIngreso, eliminarIngreso, getIngresos } from '../controllers/ingreso.js';
import { validarjwt } from '../middlewares/validarjwt.js';
import { validarCampos } from '../middlewares/validarCampos.js';
import { check } from 'express-validator';


const router = Router();


//Todas las peticiones deben pasar por la validación de token 
router.use( validarjwt )

//Obtener eventos
router.get(
    '/', 
    getIngresos );

//Crear Un nuevo Evento 
router.post( 
    '/', 
    [//Middlewares
        check('remission', 'El número de remisión es obligatorio').not().isEmpty(),
        check('volume', 'El volumen de remisión es obligatorio').isFloat({ min: 0 }),
        check('realVolume', 'El volumen real es obligatorio').isFloat({ min: 0 }),
        check('price', 'El precio por litro es obligatorio').isFloat({ min: 0 }),
        check('fat', 'El porcentaje de grasa es obligatorio').isFloat({ min: 0 }),
        check('protein', 'El porcentaje de proteína es obligatorio').isFloat({ min: 0 }),
        check('temperature', 'La temperatura es obligatoria').isFloat({ min: 0 }),
        check('pH', 'El pH es obligatorio').isFloat({ min: 0 }),
        check('density', 'La densidad es obligatoria').isFloat({ min: 0 }),
        check('quality', 'La calidad es obligatoria')
          .isIn(['Excelente', 'Buena', 'Regular', 'Deficiente']),
    ],
    validarCampos,
    crearIngreso );


//Editar  Evento 
router.put( 
    '/:id', 
   [//Middlewares
        check('id', 'No es un ID válido').isMongoId(),
        check('remission').optional().not().isEmpty(),
        check('volume').optional().isFloat({ min: 0 }), 
        check('realVolume').optional().isFloat({ min: 0 }),
        check('price').optional().isFloat({ min: 0 }),
        check('fat').optional().isFloat({ min: 0 }),
        check('protein').optional().isFloat({ min: 0 }),
        check('temperature').optional().isFloat({ min: 0 }),
        check('pH').optional().isFloat({ min: 0 }),
        check('density').optional().isFloat({ min: 0 }),
        check('quality').optional().isIn(['Excelente', 'Buena', 'Regular', 'Deficiente']),
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




    

    
 