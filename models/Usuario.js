import mongoose from "mongoose";

const {Schema, model} = mongoose

const UsuarioSchema = Schema({
    name: {
        type: String,
        required: true
    },
     lastName: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    phone:{
        type: String,
        unique: true,
        sparse: true,
        lowercase: true, 
        trim: true
    },
    password:{
        type: String,
        required: true,
        unique: true
    },
    rol: {
        type: String,
        enum: ["Administrador", "Operador"], 
        required: true
    },
    imageUrl: {
        type: String,
        default: ""
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verifyTokenHash: {
        type: String
    },
    verifyTokenExpires: {
        type: Date
    },
},
{
    timestamps: true,
    versionKey: false

});

export default model("Usuario", UsuarioSchema);

