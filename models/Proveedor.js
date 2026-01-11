import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ProveedorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true, 
    },
    address: {
      type: String,
      trim: true,
      default: "", // opcional
    },
    nit: {
      type: String,
      trim: true,
      default: "", // opcional
    },
    phone: {
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
    inCharge: {
      type: String,
      trim: true,
      default: "",
    },
    active: {
      type: Boolean,
      default: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario'
    },
    imageUrl: {
      type: String,
      default: ""
    },

  },
  {
    timestamps: true, 
    versionKey: false,
  }
);

export default model("Proveedor", ProveedorSchema);
