
import Ingreso  from '../models/Ingreso.js'

export const getIngresos = async( res = response ) => {
  const ingresos = await Ingreso.find()
                                .populate('user', 'name') //Traer el name y id del user
  res.json({
    ok:true,
    ingresos
  })
}


export const crearIngreso = async( req, res = response ) => {

  //Instancia del modelo evento 
  const ingreso = new Ingreso(req.body) 
  try {
    //Id del User
    ingreso.user = req.uid;
    
    const ingresoGuardado = await ingreso.save();
    res.status(201).json({
      ok: true,
      msg: "Evento Creado exitosamente",
      ingreso: ingresoGuardado
    })
      
  } catch (err) {
    console.log(err)
    res.status(500).json({
      ok: false,
      msg: "Datos no Creados"
    })
  }

  res.json({
    ok:true,
    msg: 'CrearEventos'
  })
}

export const editarIngreso = async( req, res = response ) => {

  const ingresoId = req.params.id

  try {
    const ingreso = Ingreso.findById( ingresoId );
    if( !ingreso ) {
      res.status(404).json({
        ok: false,
        msg: 'Ingreso no existe por el ID'
      })
    }

    const nuevoIngreso = {
      ...req.body,
      user: req.uid
    }

    const ingresoActualizado = await Ingreso.findByIdAndUpdate( ingresoId, nuevoIngreso, { new: true }  )
    res.json({
      ok: true,
      ingreso: ingresoActualizado
    })
    
  } catch (err) {
    console.log(err)
    res.status(500).json({
      ok: false,
      msg: 'No se pudo actualizar'
    })
  }

  res.json({
    ok:true,
    ingresoId
  })
}

export const eliminarIngreso = async (req, res = response) => {
  
  try {
    const ingreso = await Ingreso.findByIdAndDelete(req.params.id);

    if (!ingreso) {
      return res.status(404).json({
        ok: false,
        msg: 'Ingreso no encontrado'
      });
    }

    res.json({
      ok: true,
      msg: 'Ingreso eliminado correctamente',
      ingreso
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      msg: 'Error al eliminar ingreso'
    });
  }
};




