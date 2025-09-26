import {response} from 'express'
import bcrypt from 'bcryptjs';
import Usuario from '../models/Usuario.js'

export const crearUsuario = async(req, res = response) => {
   try {
    const { name, lastName, rol, email, password } = req.body;

    // 🔎 Verificar si ya existe el correo
    let usuario = await Usuario.findOne({ email });
    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: "El correo ya está registrado"
      });
    }

    // Crear usuario
    usuario = new Usuario({ name, lastName, rol, email, password });

    //Encriptar Contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt)

    await usuario.save();

    res.status(201).json({
      ok: true,
      msg: "Usuario registrado correctamente",
      uid: usuario.id,
      name: usuario.name
    });
  } catch (error) {
    console.error("❌ Error al crear usuario:", error);
    res.status(500).json({
      ok: false,
      msg: "Error en el servidor"
    });
  }
}


export const loginUsuario = async(req, res = response) => {
  
    try {
        const { email, password} = req.body;

        // 🔎 Verificar si ya existe el correo
        let usuario = await Usuario.findOne({ email });
        if (!usuario) {
          return res.status(400).json({
            ok: false,
            msg: "El Usuario no Existe con ese Email"
            });
        }

        //Validar Password
       const validPassword = bcrypt.compareSync(password, usuario.password)
       if(!validPassword){
           return res.status(400).json({
                ok: false,
                msg: 'Contraseña Incorrecta'
            })
        }
        
       // Generar Nuestro JWT
        res.json({
            ok:true,
            uid: usuario.id,
            name: usuario.name
        })


    } catch (error) {
            console.error("❌ Error al crear usuario:", error);
            res.status(500).json({
            ok: false,
            msg: "Error en el servidor"
        });  
    }
     
   
}


export const revalidarToken = ( req, res = response ) => {
    res.json({
        ok:true,
        msg: 'Pagina de Recuperar contraseña'
    })
}

