import { response } from "express"
import Proveedor from "../models/Proveedor.js"

export const getProveedores = async(req, res) => {
    try {
        const proveedor = await Proveedor.find().populate( 'user','name active' )
        return res.json({
          ok: true,
          proveedor,
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener Proveedores'
        })
    }
}

export const CrearProveedor = async(req, res = response) => {

    const proveedor = new Proveedor(req.body)
    console.log(proveedor)
    try {
        proveedor.user = req.uid

        const proveedorGuardado = await proveedor.save()
        res.status(201).json({
          ok: true,
          msg: "Evento Creado exitosamente",
          proveedor: proveedorGuardado
        })  
    } catch (err) {
        console.log(err)
        res.status(500).json({
            ok: false,
            msg: "Datos no Creados"
        })
    }
}

export const editarProveedor = async(req, res) => {

    const proveedorId = req.params.id
    try {
        const proveedor = Proveedor.findById(proveedorId)
        if(!proveedor){
            res.status(404).json({
                ok: false,
                msg: 'Proveedor no existe por el ID'
            })
        }

        const nuevoProveedor = {
            ...req.body,
            user: req.uid
        }

        const proveedorActualizado = await proveedor.findByIdAndUpdate(proveedorId, nuevoProveedor, {new: true})
         res.json({
            ok: true,
            proveedor: proveedorActualizado
        })
        
    } catch (err) {
        console.log(err)
        res.status(500).json({
            ok: false,
            msg: "Datos no Actualizados"
        })
    }

   
}

export const eliminarProveedor = async(req, res) => {

    const proveedorId = req.params.id
    try {
        const proveedor = await Proveedor.findByIdAndDelete( proveedorId );
          if(!proveedor){
            res.status(404).json({
                ok: false,
                msg: 'Proveedor no encontrado'
            })
        }

        res.json({
          ok: true,
          msg: 'Proveedor eliminado correctamente',
          proveedor
        });
        
    } catch (err) {
        console.log(err)
        res.status(500).json({
            ok:false,
            msg: 'Datos No Eliminados'
        })
    }
}