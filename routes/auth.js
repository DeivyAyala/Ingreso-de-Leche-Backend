
//* Rutas de Ususarios / Auth
//* Host /api/auth

import { Router } from 'express';
import { check } from 'express-validator';

import {crearUsuario, loginUsuario, revalidarToken}  from '../controllers/auth.js'

const router = Router();



router.post(
    '/new',
    [ //middelware
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('lastName', 'El apellido es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('rol', 'El rol es obligatorio').not().isEmpty(),
        check('password', 'La contraseña debe de 6 caracteres').isLength({min: 6})
    ], 
    crearUsuario
)
router.post(
    '/', 
    [
        //middelware
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'La contraseña debe de 6 caracteres').not().isEmpty()
    ], 
    loginUsuario)

router.get('/renew', revalidarToken)

export default router;