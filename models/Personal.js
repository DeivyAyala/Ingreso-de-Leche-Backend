import mongoose from "mongoose";

const {Schema, model} = mongoose

const PersonalSchema = Schema(
  {
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    active: {
      type: Boolean,
      default: true, // true = active, false = inactive
    },
    role: {
        type: String,
        enum: ["Supervisor", "Calidad"], 
        required: true
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

export default model("Personal", PersonalSchema);