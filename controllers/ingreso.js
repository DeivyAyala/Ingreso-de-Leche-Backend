import { response } from "express";
import Ingreso from "../models/Ingreso.js";
import Tanque from "../models/Tanque.js";
import Personal from "../models/Personal.js";
import { toUtcDate } from "../helpers/timeZone.js";

export const getIngresos = async (req, res) => {
  try {
    const ingresos = await Ingreso.find()
      .populate("provider", "name phone email active")
      .populate("user", "name")
      .populate("tank", "name active")
      .populate("supervisor", "name active")
      .populate("analyst", "name active");

    return res.json({
      ok: true,
      ingresos,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: "Error al obtener los ingresos",
    });
  }
};

export const getIngresoById = async (req, res = response) => {
  const { id } = req.params;

  try {
    const ingreso = await Ingreso.findById(id)
      .populate("provider", "name phone email")
      .populate("user", "name")
      .populate("tank", "name")
      .populate("supervisor", "name role")
      .populate("analyst", "name role");

    if (!ingreso) {
      return res.status(404).json({
        ok: false,
        msg: "Ingreso no encontrado con el ID especificado",
      });
    }

    return res.json({
      ok: true,
      ingreso,
    });
  } catch (error) {
    console.error("? Error al obtener ingreso por ID:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error al obtener el ingreso",
    });
  }
};

export const crearIngreso = async (req, res = response) => {
  try {
    const { supervisor, analyst, tank, realVolume } = req.body;

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

    if (tank) {
      const tanqueActual = await Tanque.findById(tank);
      if (!tanqueActual) {
        return res.status(400).json({
          ok: false,
          msg: "El tanque especificado no existe",
        });
      }

      const volumenReal = Number(realVolume) || 0;
      const nuevaCapacidad = (tanqueActual.currentCapacity || 0) + volumenReal;

      if (nuevaCapacidad > tanqueActual.capacity) {
        return res.status(400).json({
          ok: false,
          msg: "La cantidad ingresada supera la capacidad maxima del tanque",
        });
      }

      tanqueActual.currentCapacity = nuevaCapacidad;
      await tanqueActual.save();
    }

    const ingreso = new Ingreso({
      ...req.body,
      customDate: toUtcDate(req.body.customDate),
      user: req.uid,
    });

    const ingresoGuardado = await ingreso.save();

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

export const editarIngreso = async (req, res = response) => {
  const ingresoId = req.params.id;

  try {
    const ingresoActual = await Ingreso.findById(ingresoId).populate(
      "provider",
      "isActive"
    );

    if (!ingresoActual) {
      return res.status(404).json({
        ok: false,
        msg: "Ingreso no existe",
      });
    }

    if (req.body.provider) {
      const mismoProveedor =
        ingresoActual.provider &&
        ingresoActual.provider._id.toString() === req.body.provider;

      if (!mismoProveedor && ingresoActual.provider?.active === false) {
        return res.status(400).json({
          ok: false,
          msg: "No puedes asignar un proveedor inactivo",
        });
      }
    }

    if (req.body.analyst) {
      const mismoCalidad =
        ingresoActual.analyst &&
        ingresoActual.analyst._id.toString() === req.body.analyst;

      if (!mismoCalidad && ingresoActual.analyst.active === false) {
        return res.status(400).json({
          ok: false,
          msg: "No puedes asignar un Analista de Calidad Inactivo",
        });
      }
    }

    if (req.body.supervisor) {
      const mismoSupervisor =
        ingresoActual.supervisor &&
        ingresoActual.supervisor._id.toString() === req.body.supervisor;

      if (!mismoSupervisor && ingresoActual.supervisor.active === false) {
        return res.status(400).json({
          ok: false,
          msg: "No puedes asignar un Supervisor Inactivo",
        });
      }
    }

    if (req.body.tank) {
      const mismoTanque =
        ingresoActual.tank && ingresoActual.tank._id.toString() === req.body.tank;

      if (!mismoTanque && ingresoActual.tank.active === false) {
        return res.status(400).json({
          ok: false,
          msg: "No puedes asignar un Tanque Inactivo",
        });
      }
    }

    const oldTankId = ingresoActual.tank ? ingresoActual.tank.toString() : null;
    const newTankId = req.body.tank ? req.body.tank : oldTankId;

    const oldRealVolume = ingresoActual.realVolume || 0;
    const newRealVolume =
      typeof req.body.realVolume !== "undefined"
        ? Number(req.body.realVolume) || 0
        : oldRealVolume;

    if (newTankId) {
      if (oldTankId && oldTankId === newTankId) {
        const tanque = await Tanque.findById(newTankId);
        if (!tanque) {
          return res.status(400).json({
            ok: false,
            msg: "El tanque especificado no existe",
          });
        }

        const nuevaCapacidad =
          (tanque.currentCapacity || 0) - oldRealVolume + newRealVolume;

        if (nuevaCapacidad > tanque.capacity || nuevaCapacidad < 0) {
          return res.status(400).json({
            ok: false,
            msg: "La cantidad ingresada supera la capacidad maxima del tanque",
          });
        }

        tanque.currentCapacity = nuevaCapacidad;
        await tanque.save();
      } else {
        if (oldTankId) {
          const oldTanque = await Tanque.findById(oldTankId);
          if (oldTanque) {
            const capacidadAjustada =
              (oldTanque.currentCapacity || 0) - oldRealVolume;
            oldTanque.currentCapacity = Math.max(0, capacidadAjustada);
            await oldTanque.save();
          }
        }

        const newTanque = await Tanque.findById(newTankId);
        if (!newTanque) {
          return res.status(400).json({
            ok: false,
            msg: "El tanque especificado no existe",
          });
        }

        const nuevaCapacidad = (newTanque.currentCapacity || 0) + newRealVolume;

        if (nuevaCapacidad > newTanque.capacity) {
          return res.status(400).json({
            ok: false,
            msg: "La cantidad ingresada supera la capacidad maxima del tanque",
          });
        }

        newTanque.currentCapacity = nuevaCapacidad;
        await newTanque.save();
      }
    }

    const ingresoActualizado = await Ingreso.findByIdAndUpdate(
      ingresoId,
      {
        ...req.body,
        customDate: req.body.customDate ? toUtcDate(req.body.customDate) : ingresoActual.customDate,
        user: req.uid,
      },
      { new: true }
    );

    res.json({
      ok: true,
      ingreso: ingresoActualizado,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "No se pudo actualizar el ingreso",
    });
  }
};

export const eliminarIngreso = async (req, res = response) => {
  try {
    const ingreso = await Ingreso.findById(req.params.id);

    if (!ingreso) {
      return res.status(404).json({
        ok: false,
        msg: "Ingreso no encontrado",
      });
    }

    if (ingreso.tank) {
      const tanque = await Tanque.findById(ingreso.tank);
      if (tanque) {
        const volumenReal = Number(ingreso.realVolume) || 0;
        const capacidadAjustada = (tanque.currentCapacity || 0) - volumenReal;
        tanque.currentCapacity = Math.max(0, capacidadAjustada);
        await tanque.save();
      }
    }

    await Ingreso.findByIdAndDelete(req.params.id);

    res.json({
      ok: true,
      msg: "Ingreso eliminado correctamente",
      ingreso,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      msg: "Error al eliminar ingreso",
    });
  }
};
