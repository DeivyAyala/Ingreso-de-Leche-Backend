//* Rutas de Personal
//* Host /api/personal

import { Router } from "express";
import {
  getPersonal,
  crearPersonal,
  editarPersonal,
  eliminarPersonal,
} from "../controllers/personal.js";
import { validarjwt } from "../middlewares/validarjwt.js";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validarCampos.js";
import { upload } from "../config/multer.js";
import { subirImagenPersonal } from "../controllers/personalImagen.js";

const router = Router();

// Todas las peticiones deben pasar por la validación del token
router.use(validarjwt);

// Obtener todo el personal
router.get(
  "/",
  [
    check("rol").optional().isIn(["Supervisor", "Calidad"]),
    check("role").optional().isIn(["Supervisor", "Calidad"]),
    validarCampos,
  ],
  getPersonal
);


// Crear nuevo personal
router.post(
  "/",
  [
    // Middlewares
    check("name", "El nombre del personal es obligatorio").not().isEmpty(),
    check("email", "El correo no es válido").isEmail(),
    check("phone", "El número de teléfono no es válido")
      .optional()
      .isString()
      .isLength({ min: 7 }),
    check("role", "El rol es obligatorio y debe ser válido")
      .isIn(["Supervisor", "Calidad"]),
    validarCampos,
  ],
  crearPersonal
);

// Subir imagen al personal
router.post(
  "/:id/imagen",
  [
    validarCampos
  ],
  upload.single("imagen"),
  subirImagenPersonal
);


// Editar personal
router.put(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    check("email", "El correo no es válido").optional().isEmail(),
    check("role", "El rol debe ser válido")
      .optional()
      .isIn(["Supervisor", "Calidad"]),
    check("active", "El estado debe ser booleano")
      .optional()
      .isBoolean()
      .toBoolean(),
    validarCampos,
  ],
  editarPersonal
);

// Eliminar personal
router.delete(
  "/:id",
  [check("id", "No es un ID válido").isMongoId(), validarCampos],
  eliminarPersonal
);

export default router;
