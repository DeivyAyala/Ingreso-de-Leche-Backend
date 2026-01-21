import mongoose from "mongoose";

const { Schema, model } = mongoose;

const MovimientoSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["PROCESO", "TRASLADO", "VENTA"],
      required: true,
    },
    processType: {
      type: String,
      enum: ["Planta", "Derivados/Fermentados", "Planta UHT"],
    },
    originTank: {
      type: Schema.Types.ObjectId,
      ref: "Tanque",
    },
    destinationTank: {
      type: Schema.Types.ObjectId,
      ref: "Tanque",
    },
    client: {
      type: String,
      trim: true,
      default: "",
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    movementDate: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Movimiento", MovimientoSchema);
