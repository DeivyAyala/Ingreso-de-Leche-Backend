import { response } from "express";
import Movimiento from "../models/Movimiento.js";
import Tanque from "../models/Tanque.js";

export const getMovimientos = async (req, res = response) => {
  try {
    const movimientos = await Movimiento.find()
      .populate("originTank", "name active")
      .populate("destinationTank", "name active")
      .populate("user", "name")
      .sort({ createdAt: -1 });

    return res.json({
      ok: true,
      movimientos,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: "Error al obtener los movimientos",
    });
  }
};

export const crearMovimiento = async (req, res = response) => {
  try {
    const {
      type,
      processType,
      originTank,
      destinationTank,
      client,
      quantity,
      movementDate,
    } = req.body;

    const cantidad = Number(quantity) || 0;
    if (cantidad <= 0) {
      return res.status(400).json({
        ok: false,
        msg: "La cantidad debe ser mayor a 0",
      });
    }

    if (!originTank) {
      return res.status(400).json({
        ok: false,
        msg: "El tanque de origen es obligatorio",
      });
    }

    const tanqueOrigen = await Tanque.findById(originTank);
    if (!tanqueOrigen) {
      return res.status(400).json({
        ok: false,
        msg: "El tanque de origen no existe",
      });
    }
    if (tanqueOrigen.active === false) {
      return res.status(400).json({
        ok: false,
        msg: "No puedes usar un tanque de origen inactivo",
      });
    }

    if (tanqueOrigen.currentCapacity < cantidad) {
      return res.status(400).json({
        ok: false,
        msg: "La cantidad supera la capacidad disponible del tanque",
      });
    }

    if (type === "PROCESO") {
      if (!processType) {
        return res.status(400).json({
          ok: false,
          msg: "El tipo de proceso es obligatorio",
        });
      }

      tanqueOrigen.currentCapacity =
        (tanqueOrigen.currentCapacity || 0) - cantidad;
      await tanqueOrigen.save();
    } else if (type === "TRASLADO") {
      if (!destinationTank) {
        return res.status(400).json({
          ok: false,
          msg: "El tanque destino es obligatorio",
        });
      }
      if (destinationTank === originTank) {
        return res.status(400).json({
          ok: false,
          msg: "El tanque destino debe ser diferente al tanque de origen",
        });
      }

      const tanqueDestino = await Tanque.findById(destinationTank);
      if (!tanqueDestino) {
        return res.status(400).json({
          ok: false,
          msg: "El tanque destino no existe",
        });
      }
      if (tanqueDestino.active === false) {
        return res.status(400).json({
          ok: false,
          msg: "No puedes usar un tanque destino inactivo",
        });
      }

      const nuevaCapacidadDestino =
        (tanqueDestino.currentCapacity || 0) + cantidad;
      if (nuevaCapacidadDestino > tanqueDestino.capacity) {
        return res.status(400).json({
          ok: false,
          msg: "La cantidad supera la capacidad maxima del tanque destino",
        });
      }

      tanqueOrigen.currentCapacity =
        (tanqueOrigen.currentCapacity || 0) - cantidad;
      tanqueDestino.currentCapacity = nuevaCapacidadDestino;

      await tanqueOrigen.save();
      await tanqueDestino.save();
    } else if (type === "VENTA") {
      if (!client || client.trim().length === 0) {
        return res.status(400).json({
          ok: false,
          msg: "El cliente es obligatorio",
        });
      }

      tanqueOrigen.currentCapacity =
        (tanqueOrigen.currentCapacity || 0) - cantidad;
      await tanqueOrigen.save();
    } else {
      return res.status(400).json({
        ok: false,
        msg: "Tipo de movimiento no valido",
      });
    }

    const movimiento = new Movimiento({
      type,
      processType: type === "PROCESO" ? processType : undefined,
      originTank,
      destinationTank: type === "TRASLADO" ? destinationTank : undefined,
      client: type === "VENTA" ? client : undefined,
      quantity: cantidad,
      movementDate,
      user: req.uid,
    });

    const movimientoGuardado = await movimiento.save();
    await movimientoGuardado.populate([
      { path: "originTank", select: "name" },
      { path: "destinationTank", select: "name" },
      { path: "user", select: "name" },
    ]);

    return res.status(201).json({
      ok: true,
      msg: "Movimiento creado exitosamente",
      movimiento: movimientoGuardado,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: "Error al crear el movimiento",
    });
  }
};

export const eliminarMovimiento = async (req, res = response) => {
  try {
    const movimiento = await Movimiento.findById(req.params.id);

    if (!movimiento) {
      return res.status(404).json({
        ok: false,
        msg: "Movimiento no encontrado",
      });
    }

    await Movimiento.findByIdAndDelete(req.params.id);

    return res.json({
      ok: true,
      msg: "Movimiento eliminado correctamente",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: "Error al eliminar el movimiento",
    });
  }
};
