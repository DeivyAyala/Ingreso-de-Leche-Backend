import mongoose from "mongoose";

export const dbConection = async() => {
    try{
        await mongoose.connect(process.env.DB_CNN);
        console.log('DB Online o Conectado')
        console.log("Intentando conectar a:", process.env.DB_CNN)

    } catch(error){
        console.log(error)
        throw new Error('Error al incializar Base de Dstos')
    }
}