
import { response } from "express";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const subirImagen = async ({
  Model,
  id,
  folder,
  res,
  req,
}) => {
  try {
    const registro = await Model.findById(id);

    if (!registro) {
      return res.status(404).json({
        ok: false,
        msg: "Registro no encontrado",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        ok: false,
        msg: "No se envió ninguna imagen",
      });
    }

    const resultado = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) reject(error);
          resolve(result);
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    registro.imageUrl = resultado.secure_url;
    await registro.save();

    res.json({
      ok: true,
      msg: "Imagen subida correctamente",
      imageUrl: registro.imageUrl,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error al subir imagen",
    });
  }
};
