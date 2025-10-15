import mongoose from "mongoose";

const { Schema, model } = mongoose;

const IngresoSchema = new Schema(
  {
    // 🔹 Relación con proveedor (referencia a otro modelo)
    provider: {
      type: Schema.Types.ObjectId,
      ref: "Proveedor", // nombre del modelo de proveedores
      required: true,
    },
    remission: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    volume: {
      type: Number, // volumen de remisión (L)
      required: true,
      min: 0,
    },
    realVolume: {
      type: Number, // volumen real recibido (L)
      required: true,
      min: 0,
    },
    price: {
      type: Number, // precio por litro
      required: true,
      min: 0,
    },

    // 🔹 Parámetros de calidad
    fat: {
      type: Number, // grasa %
      required: true,
      min: 0,
    },
    protein: {
      type: Number, // proteína %
      required: true,
      min: 0,
    },
    temperature: {
      type: Number, // °C
      required: true,
      min: 0,
    },
    pH: {
      type: Number,
      required: true,
      min: 0,
    },
    density: {
      type: Number, // g/ml
      required: true,
      min: 0,
    },

    // 🔹 Evaluación general
    quality: {
      type: String,
      enum: ["Excelente", "Buena", "Regular", "Deficiente"],
      required: true,
    },

    // 🔹 Responsable y firma
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario'
    },
    firma: {
      type: String,
      trim: true,
    },

    // 🔹 Notas adicionales
    notes: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true, // crea automáticamente createdAt y updatedAt
    versionKey: false,
  }
);

export default model("Ingreso", IngresoSchema);
