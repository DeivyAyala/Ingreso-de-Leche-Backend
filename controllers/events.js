
import Evento  from '../models/Evento.js'

export const getEventos = ( req, res = response ) => {
    res.json({
      ok:true,
      msg: 'getEventos'
    })
}


export const crearEvento = async( req, res = response ) => {

  //Instancia del modelo evento 
  const evento = new Evento(req.body) 
  try {
    //Id del User
    evento.user = req.uid;
    
    const eventoGuardado = await evento.save();
    res.status(201).json({
      ok: true,
      msg: "Evento Creado exitosamente",
      evento: eventoGuardado
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

export const editarEvento = ( req, res = response ) => {
    res.json({
      ok:true,
      msg: 'editarEvento'
    })
}

export const eliminarEvento = ( req, res = response ) => {
    res.json({
      ok:true,
      msg: 'eliminarEvento'
    })
}



