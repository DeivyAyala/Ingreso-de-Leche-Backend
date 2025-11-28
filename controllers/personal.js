import { response } from "express";
import Personal from "../models/Personal.js";

export const getPersonal = async (req, res) => {
  try {
    const { role } = req.query;

    // Si viene rol → filtramos
    // Si no viene → traemos todo
    const query = role ? { role } : {};

    const personal = await Personal.find(query);

    return res.json({
      ok: true,
      personal,
    });

  } catch (error) {
    console.error("Error en getPersonal:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error al obtener personal",
    });
  }
};



   // CREAR NUEVO REGISTRO

export const crearPersonal = async (req, res = response) => {
  const personal = new Personal(req.body);

  try {
    const nuevoPersonal = await personal.save();

    res.status(201).json({
      ok: true,
      msg: "Personal creado exitosamente",
      personal: nuevoPersonal,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      msg: "Error al crear el personal",
    });
  }
};


   // EDITAR / ACTUALIZAR REGISTRO

export const editarPersonal = async (req, res = response) => {
  const personalId = req.params.id;

  try {
    const existe = await Personal.findById(personalId);

    if (!existe) {
      return res.status(404).json({
        ok: false,
        msg: "El personal no existe por ese ID",
      });
    }

    const datosActualizados = {
      ...req.body,
    };

    const personalActualizado = await Personal.findByIdAndUpdate(
      personalId,
      datosActualizados,
      { new: true }
    );

    res.json({
      ok: true,
      msg: "Personal actualizado correctamente",
      personal: personalActualizado,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      msg: "Error al actualizar el personal",
    });
  }
};


    // ELIMINAR REGISTRO
export const eliminarPersonal = async (req, res = response) => {
  const personalId = req.params.id;

  try {
    const personal = await Personal.findByIdAndDelete(personalId);

    if (!personal) {
      return res.status(404).json({
        ok: false,
        msg: "El personal no fue encontrado",
      });
    }

    res.json({
      ok: true,
      msg: "Personal eliminado correctamente",
      personal,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      msg: "Error al eliminar el personal",
    });
  }
};
