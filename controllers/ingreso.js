
import Ingreso from "../models/Ingreso.js";
import Personal from "../models/Personal.js";
import { response } from "express";

export const getIngresos = async (req, res) => {
  try {
    const ingresos = await Ingreso.find()
                                  .populate('provider', 'name phone email') 
                                  .populate('user', 'name')// Trae el nombre del ususario
                                  .populate('tank', 'name')
                                  .populate('supervisor', 'name')
                                  .populate('analyst', 'name')

    return res.json({
      ok: true,
      ingresos,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: 'Error al obtener los ingresos',
    });
  }
};

export const getIngresoById = async (req, res = response) => {
  const { id } = req.params;

  try {
    // Buscar el ingreso por su ID y poblar las relaciones
    const ingreso = await Ingreso.findById(id)
      .populate('provider', 'name phone email')
      .populate('user', 'name')
      .populate('tank', 'name')
      .populate('supervisor', 'name role')
      .populate('analyst', 'name role');

    // Si no se encuentra, devolver error 404
    if (!ingreso) {
      return res.status(404).json({
        ok: false,
        msg: "Ingreso no encontrado con el ID especificado",
      });
    }

    // Devolver el ingreso encontrado
    return res.json({
      ok: true,
      ingreso,
    });

  } catch (error) {
    console.error("❌ Error al obtener ingreso por ID:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error al obtener el ingreso",
    });
  }
};


export const crearIngreso = async (req, res = response) => {
  try {
    const { supervisor, analyst } = req.body;

    // Validar supervisor
    if (supervisor) {
      const sup = await Personal.findById(supervisor);
      if (!sup) {
        return res.status(400).json({
          ok: false,
          msg: "El supervisor especificado no existe",
        });
      }
      if (sup.role !== "Supervisor") {
        return res.status(400).json({
          ok: false,
          msg: "El personal asignado no tiene el rol 'Supervisor'",
        });
      }
    }

    // Validar analista de calidad
    if (analyst) {
      const an = await Personal.findById(analyst);
      if (!an) {
        return res.status(400).json({
          ok: false,
          msg: "El analista especificado no existe",
        });
      }
      if (an.role !== "Calidad") {
        return res.status(400).json({
          ok: false,
          msg: "El personal asignado no tiene el rol 'Calidad'",
        });
      }
    }

    // Crear nuevo ingreso
    const ingreso = new Ingreso({
      ...req.body,
      user: req.uid, // Usuario autenticado que registra
    });

    const ingresoGuardado = await ingreso.save();

    // Opcional: populate para devolver información más completa
    await ingresoGuardado.populate([
      { path: "provider", select: "name" },
      { path: "supervisor", select: "name role" },
      { path: "analyst", select: "name role" },
    ]);

    res.status(201).json({
      ok: true,
      msg: "Ingreso creado exitosamente",
      ingreso: ingresoGuardado,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      msg: "Error al crear el ingreso",
    });
  }
};




export const editarIngreso = async( req, res = response ) => {

  const ingresoId = req.params.id

  try {
    const ingreso = Ingreso.findById( ingresoId );
    if( !ingreso ) {
      res.status(404).json({
        ok: false,
        msg: 'Ingreso no existe por el ID'
      })
    }

    const nuevoIngreso = {
      ...req.body,
      user: req.uid
    }

    const ingresoActualizado = await Ingreso.findByIdAndUpdate( ingresoId, nuevoIngreso, { new: true }  )
    res.json({
      ok: true,
      ingreso: ingresoActualizado
    })
    
  } catch (err) {
    console.log(err)
    res.status(500).json({
      ok: false,
      msg: 'No se pudo actualizar'
    })
  }
  
}

export const eliminarIngreso = async (req, res = response) => {
  
  try {
    const ingreso = await Ingreso.findByIdAndDelete(req.params.id);

    if (!ingreso) {
      return res.status(404).json({
        ok: false,
        msg: 'Ingreso no encontrado'
      });
    }

    res.json({
      ok: true,
      msg: 'Ingreso eliminado correctamente',
      ingreso
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      msg: 'Error al eliminar ingreso'
    });
  }
};




