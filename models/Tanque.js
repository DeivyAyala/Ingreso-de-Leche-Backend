import mongoose from "mongoose";

const { Schema, model } = mongoose;

const TanqueSchema = new Schema(
  {
    // 🔹 Tank name
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // 🔹 Tank capacity in liters
    capacity: {
      type: Number,
      required: true,
      min: 0,
    },

    // 🔹 Tank status: active or inactive
    active: {
      type: Boolean,
      default: true, // true = active, false = inactive
    },

    // 🔹 User who created the tank
    user: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt
    versionKey: false,
  }
);

export default model("Tanque", TanqueSchema);
