import Usuario from "../models/Usuario.js"
import { subirImagen } from "./subirImagen.js";

export const subirImagenAuth = (req, res) => {
  subirImagen({
    Model: Usuario, 
    id: req.params.id,
    folder: "usuarios",
    req,
    res,
  });
}