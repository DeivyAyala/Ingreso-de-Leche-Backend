import Proveedor from "../models/Proveedor.js";
import { subirImagen } from "./subirImagen.js";

export const subirImagenProveedor = (req, res) => {
  subirImagen({
    Model: Proveedor,
    id: req.params.id,
    folder: "proveedores",
    req,
    res,
  });
};
