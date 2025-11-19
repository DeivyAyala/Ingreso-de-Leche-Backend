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
    password:{
        type: String,
        required: true,
        unique: true
    },
    rol: {
        type: String,
        enum: ["Administrador", "Operador"], 
        required: true
    }

});

export default model("Usuario", UsuarioSchema);

