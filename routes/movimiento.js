//* Rutas de Movimientos
//* Host /api/movimiento

import { Router } from "express";
import { check } from "express-validator";
import {
  crearMovimiento,
  eliminarMovimiento,
  getMovimientos,
} from "../controllers/movimiento.js";
import { validarjwt } from "../middlewares/validarjwt.js";
import { validarCampos } from "../middlewares/validarCampos.js";

const router = Router();

router.use(validarjwt);

// Ver movimientos
router.get("/", getMovimientos);

// Crear movimiento
router.post(
  "/",
  [
    check("type", "El tipo de movimiento es obligatorio").not().isEmpty(),
    check("quantity", "La cantidad debe ser un numero positivo").isFloat({
      min: 0.01,
    }),
  ],
  validarCampos,
  crearMovimiento
);

// Eliminar movimiento
router.delete(
  "/:id",
  check("id", "No es un ID valido").isMongoId(),
  validarCampos,
  eliminarMovimiento
);

export default router;
