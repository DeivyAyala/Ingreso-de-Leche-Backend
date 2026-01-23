//* Rutas de Dashboard
//* Host /api/dashboard

import { Router } from "express";
import { check } from "express-validator";
import { getDashboard } from "../controllers/dashboard.js";
import { validarjwt } from "../middlewares/validarjwt.js";
import { validarCampos } from "../middlewares/validarCampos.js";

const router = Router();

router.use(validarjwt);

router.get(
  "/",
  [
    check("range", "El rango es obligatorio").not().isEmpty(),
    check("range", "Rango no valido").isIn(["day", "week", "month", "year"]),
    check("date", "Fecha no valida").optional().isISO8601({ strict: true }),
  ],
  validarCampos,
  getDashboard
);

export default router;
