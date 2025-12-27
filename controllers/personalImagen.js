import Personal from "../models/Personal.js";
import { subirImagen } from "./subirImagen.js";

export const subirImagenPersonal = (req, res) => {
  subirImagen({
    Model: Personal,
    id: req.params.id,
    folder: "personal",
    req,
    res,
  });
};
