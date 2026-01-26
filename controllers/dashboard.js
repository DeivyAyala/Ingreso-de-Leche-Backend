import { response } from "express";
import Ingreso from "../models/Ingreso.js";
import Movimiento from "../models/Movimiento.js";
import Tanque from "../models/Tanque.js";
import { getDateRange } from "../helpers/dateRange.js";
import { buildBuckets, buildGroupExpression } from "../helpers/buckets.js";

const roundTo = (value, decimals = 0) => {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

const getTankStatus = (tank, percent) => {
  if (!tank.active) {
    return "FUERA_SERVICIO";
  }
  if (percent >= 90) {
    return "ALERTA_ALTA";
  }
  if (percent <= 10) {
    return "ALERTA_BAJA";
  }
  return "OK";
};

export const getDashboard = async (req, res = response) => {
  try {
    const { range, date } = req.query;
    const dateRange = getDateRange(range, date, "America/Bogota");

    if (!dateRange) {
      return res.status(400).json({
        ok: false,
        msg: "Rango o fecha invalida",
      });
    }

    const { from, to, timeZone } = dateRange;
    const { labels, keys } = buildBuckets(range, from, to);
    const ingresoGroup = buildGroupExpression(range, "customDate", timeZone);
    const movimientoGroup = buildGroupExpression(range, "movementDate", timeZone);

    const [
      ingresoTotalAgg,
      movimientoTipoAgg,
      ingresoSeriesAgg,
      movimientoSeriesAgg,
      tanks,
    ] = await Promise.all([
      Ingreso.aggregate([
        { $match: { customDate: { $gte: from, $lt: to } } },
        { $group: { _id: null, total: { $sum: "$realVolume" } } },
      ]),
      Movimiento.aggregate([
        {
          $match: {
            movementDate: { $gte: from, $lt: to },
            type: { $in: ["PROCESO", "VENTA"] },
          },
        },
        { $group: { _id: "$type", total: { $sum: "$quantity" } } },
      ]),
      Ingreso.aggregate([
        { $match: { customDate: { $gte: from, $lt: to } } },
        { $group: { _id: ingresoGroup, total: { $sum: "$realVolume" } } },
      ]),
      Movimiento.aggregate([
        {
          $match: {
            movementDate: { $gte: from, $lt: to },
            type: { $in: ["PROCESO", "VENTA"] },
          },
        },
        { $group: { _id: movimientoGroup, total: { $sum: "$quantity" } } },
      ]),
      Tanque.find().select("name capacity currentCapacity active"),
    ]);

    const receptionLiters = ingresoTotalAgg[0]?.total || 0;
    let outputsToProcessLiters = 0;
    let outputsSalesLiters = 0;
    for (const row of movimientoTipoAgg) {
      if (row._id === "PROCESO") {
        outputsToProcessLiters = row.total;
      } else if (row._id === "VENTA") {
        outputsSalesLiters = row.total;
      }
    }

    const outputsLiters = outputsToProcessLiters + outputsSalesLiters;

    const inventoryLiters = tanks
      .filter((tank) => tank.active)
      .reduce((sum, tank) => sum + (tank.currentCapacity || 0), 0);

    const activeTanks = tanks.filter((tank) => tank.active).length;

    const tanksPayload = tanks.map((tank) => {
      const capacity = tank.capacity || 0;
      const currentCapacity = tank.currentCapacity || 0;
      const percent = capacity > 0 ? roundTo((currentCapacity / capacity) * 100, 0) : 0;
      const status = getTankStatus(tank, percent);

      return {
        _id: tank._id,
        name: tank.name,
        active: tank.active,
        capacity,
        currentCapacity,
        percent,
        status,
      };
    });

    const alertTanks = tanksPayload.filter((tank) => tank.status !== "OK").length;

    const activeTankLiters = tanksPayload
      .filter((tank) => tank.active)
      .reduce((sum, tank) => sum + (tank.currentCapacity || 0), 0);

    const inventoryDistribution = tanksPayload
      .filter((tank) => tank.active)
      .map((tank) => ({
        tankId: tank._id,
        name: tank.name,
        liters: tank.currentCapacity || 0,
        percent:
          activeTankLiters > 0
            ? roundTo((tank.currentCapacity / activeTankLiters) * 100, 1)
            : 0,
      }));

    const receptionMap = new Map(
      ingresoSeriesAgg.map((item) => [item._id, item.total])
    );
    const outputsMap = new Map(
      movimientoSeriesAgg.map((item) => [item._id, item.total])
    );

    const receptionSeries = keys.map((key) => receptionMap.get(key) || 0);
    const outputsSeries = keys.map((key) => outputsMap.get(key) || 0);

    return res.json({
      ok: true,
      range,
      from,
      to,
      timeZone,
      kpis: {
        receptionLiters,
        outputsLiters,
        outputsToProcessLiters,
        outputsSalesLiters,
        inventoryLiters,
        activeTanks,
        alertTanks,
      },
      chart: {
        labels,
        reception: receptionSeries,
        outputs: outputsSeries,
      },
      tanks: tanksPayload,
      inventoryDistribution,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: "Error al obtener el dashboard",
    });
  }
};
