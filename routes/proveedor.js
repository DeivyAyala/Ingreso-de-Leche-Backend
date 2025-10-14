//* Rutas de Proveedores / 
//* Host /api/provedor


import { Router } from "express";

import { CrearProveedor, editarProveedor, eliminarProveedor, getProveedores } from "../controllers/proveedor.js";
import { validarjwt } from "../middlewares/validarjwt.js";


const router = Router();

//Todas las peticiones deben pasar por la validación de token 
router.use( validarjwt )


router.get('/', getProveedores)

router.post('/', CrearProveedor)

router.put('/:id', editarProveedor)

router.delete('/:id', eliminarProveedor)



export default router;