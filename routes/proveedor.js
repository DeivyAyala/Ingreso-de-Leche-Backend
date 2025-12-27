//* Rutas de Proveedores / 
//* Host /api/provedor


import { Router } from "express";

import { CrearProveedor, editarProveedor, eliminarProveedor, getProveedores } from "../controllers/proveedor.js";
import { validarjwt } from "../middlewares/validarjwt.js";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validarCampos.js";
import { upload } from "../config/multer.js";
import { subirImagenProveedor } from "../controllers/proveedorImagen.js";


const router = Router();

//Todas las peticiones deben pasar por la validación de token 
router.use( validarjwt )

router.get('/', getProveedores)

router.post(
    '/',
    [//Midelwares
        check('name', 'El nombre del proveedor es obligatorio').not().isEmpty(),
        check('email', 'No es un correo').isEmail(),
        check('active', 'El estado del proveedor es obligatorio').exists().isBoolean().toBoolean(),
    ],
    validarCampos
    ,CrearProveedor
);

router.post(
  "/:id/imagen",
  [
    check("id", "No es un ID válido").isMongoId(),
    validarCampos,
  ],
  upload.single("imagen"),
  subirImagenProveedor
);

router.put(
    '/:id', 
    [//Midelwares
        check('id', 'No es un ID válido').isMongoId(),
        check('email', 'No es un correo').isEmail(),
       check('active', 'El estado del proveedor es obligatorio').exists().isBoolean().toBoolean(),
    ],
    validarCampos,
    editarProveedor)

router.delete(
    '/:id',
    check('id', 'No es un ID válido').isMongoId(),
    validarCampos,
    eliminarProveedor)


export default router;