import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ProveedorSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
      unique: true, // evita duplicados de nombres de finca
    },

    nit: {
      type: String,
      trim: true,
      default: "", // opcional
    },

    direccion: {
      type: String,
      trim: true,
      default: "",
    },

    telefono: {
      type: String,
      trim: true,
      default: "",
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    // Persona de contacto o encargado
    encargado: {
      type: String,
      trim: true,
      default: "",
    },

    // Estado del proveedor (activo / inactivo)
    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // crea createdAt y updatedAt automáticamente
    versionKey: false,
  }
);

export default model("Proveedor", ProveedorSchema);
