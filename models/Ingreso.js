import mongoose from "mongoose";

const { Schema, model } = mongoose;

const IngresoSchema = new Schema(
  {
    
    customDate: {
      type: Date,
      required: true,
    },

    provider: {
      type: Schema.Types.ObjectId,
      ref: "Proveedor",
      required: true,
    },
    volume: {
      type: Number,
      required: true,
      min: 0,
    },
    realVolume: {
      type: Number,
      required: true,
      min: 0,
    },

    
    user: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
    },

    
    tank: {
      type: Schema.Types.ObjectId,
      ref: "Tanque",
    },

    
    supervisor: {
      type: Schema.Types.ObjectId,
      ref: "Personal",
      validate: {
        validator: async function (id) {
          if (!id) return true;
          const Personal = mongoose.model("Personal");
          const person = await Personal.findById(id);
          return person && person.rol === "Supervisor";
        },
        message: "El personal asignado como supervisor no tiene el rol 'Supervisor'.",
      },
    },

    
    analyst: {
      type: Schema.Types.ObjectId,
      ref: "Personal",
      validate: {
        validator: async function (id) {
          if (!id) return true;
          const Personal = mongoose.model("Personal");
          const person = await Personal.findById(id);
          return person && person.rol === "Calidad";
        },
        message: "El personal asignado como analista no tiene el rol 'Calidad'.",
      },
    },

    notes: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Ingreso", IngresoSchema);
