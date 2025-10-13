import mongoose from "mongoose";

export const dbConection = async() => {
    try{
        await mongoose.connect(process.env.DB_CNN);
        console.log('DB Online o Conectado')

    } catch(error){
        console.log(error)
        throw new Error('Error al incializar Base de Dstos')
    }
}