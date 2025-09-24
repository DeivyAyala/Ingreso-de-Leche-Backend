
//* Rutas de Ususarios / Auth
//* Host /api/auth

const {Router} = require('express');
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const { check } = require('express-validator');
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

module.exports = router;