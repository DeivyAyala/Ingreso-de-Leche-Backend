import { response } from "express";
import Personal from "../models/Personal.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const subirImagenPersonal = async (req, res = response) => {
  const { id } = req.params;

  try {
    const personal = await Personal.findById(id);
    if (!personal) {
      return res.status(404).json({
        ok: false,
        msg: "No existe personal con ese ID"
      });
    }

    if (!req.file) {
      return res.status(400).json({
        ok: false,
        msg: "No se envió ninguna imagen"
      });
    }

    // Subir imagen a Cloudinary desde buffer
    const resultado = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "personal" },
        (error, result) => {
          if (error) reject(error);
          resolve(result);
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    // Guardar URL en MongoDB
    personal.imageUrl = resultado.secure_url;
    await personal.save();

    res.json({
      ok: true,
      msg: "Imagen subida correctamente",
      imageUrl: personal.imageUrl
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      msg: "Error al subir imagen"
    });
  }
};
