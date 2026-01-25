
//* Rutas de Ususarios / Auth
//* Host /api/auth

import { Router } from 'express';
import { check } from 'express-validator';

import {
    crearUsuario, 
    crearUsuarioAdmin, 
    editarUsuarioAdmin, 
    eliminarUsuarioAdmin, 
    getUsuarios, 
    loginUsuario, 
    revalidarToken,
    verificarCorreo
}  from '../controllers/auth.js'
import { validarCampos } from '../middlewares/validarCampos.js';
import { validarjwt } from '../middlewares/validarjwt.js';
import { subirImagenAuth } from '../controllers/authImagen.js';
import { upload } from "../config/multer.js";
const router = Router();



router.get('/usuarios', validarjwt, getUsuarios);

router.post(
    '/new',
    [ //middelware
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('lastName', 'El apellido es obligatorio').not().isEmpty(),
        check('email', 'No es un correo').isEmail(),
        check('password', 'La contraseña debe de 6 caracteres').isLength({min: 6}),
        check('rol')
            .optional()
            .isIn(['Administrador', 'Operador'])
            .withMessage('Rol no válido'),
    ], 
    validarCampos,
    crearUsuario
)

router.post(
    '/register',
    [ //middelware
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('lastName', 'El apellido es obligatorio').not().isEmpty(),
        check('email', 'No es un correo').isEmail(),
        check('password', 'La contraseña debe de 6 caracteres').isLength({min: 6}),
        check('rol')
            .optional()
            .isIn(['Administrador', 'Operador'])
            .withMessage('Rol no válido'),
    ], 
    validarjwt,
    validarCampos,
    crearUsuarioAdmin,
    
)

router.post(
    "/:id/imagen",
    [
      check("id", "No es un ID válido").isMongoId(),
      validarCampos,
    ],
    upload.single("imagen"),
    subirImagenAuth
);

router.put(
    "/:id",
    [ //middelware
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('lastName', 'El apellido es obligatorio').not().isEmpty(),
        check('email', 'No es un correo').isEmail(),
        check('rol')
            .optional()
            .isIn(['Administrador', 'Operador'])
            .withMessage('Rol no válido'),
    ], 
    validarjwt,
    validarCampos,
    editarUsuarioAdmin
)

router.delete(
  "/admin/:id",
  validarjwt,
  eliminarUsuarioAdmin
);

router.get('/verify', verificarCorreo);

router.post(
    '/login', 
    [
        //middelware
        check('email', 'El email Invalido').isEmail().normalizeEmail(),
        check('password', 'La contraseña incorrecta').isLength({min: 6})
    ], 
    validarCampos,
    loginUsuario)

router.get('/renew', validarjwt , revalidarToken)

export default router;

