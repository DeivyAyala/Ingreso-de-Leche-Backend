//* Rutas de Tanques
//* Host /api/tanque

import { Router } from "express";
import { check } from "express-validator";
import {
  crearTanque,
  editarTanque,
  eliminarTanque,
  getTanques,
} from "../controllers/tanque.js";
import { validarjwt } from "../middlewares/validarjwt.js";
import { validarCampos } from "../middlewares/validarCampos.js";

const router = Router();


router.use(validarjwt);

// Obtener todos los tanques
router.get("/", getTanques);

// Crear un nuevo tanque
router.post(
  "/",
  [
    check("name", "El nombre del tanque es obligatorio").not().isEmpty(),
    check("capacity", "La capacidad debe ser un número positivo").isFloat({ min: 0 }),
  ],
  validarCampos,
  crearTanque
);

// Editar un tanque
router.put(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    check("capacity").optional().isFloat({ min: 0 }),
  ],
  validarCampos,
  editarTanque
);

// Eliminar un tanque
router.delete(
  "/:id",
  check("id", "No es un ID válido").isMongoId(),
  validarCampos,
  eliminarTanque
);

export default router;
