import {response} from 'express'
import bcrypt from 'bcryptjs';
import Usuario from '../models/Usuario.js'
import { generarJWT } from '../helpers/jwt.js';
import { validarjwt } from '../middlewares/validarjwt.js';

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

    // Generar Nuestro JWT  
    const token = await generarJWT(usuario.id, usuario.name)

    res.status(201).json({
      ok: true,
      msg: "Usuario registrado correctamente",
      uid: usuario.id,
      name: usuario.name,
      token
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
        const token = await generarJWT(usuario.id, usuario.name)

        res.json({
            ok:true,
            uid: usuario.id,
            name: usuario.name,
            token
        })


    } catch (error) {
            console.error("❌ Error al crear usuario:", error);
            res.status(500).json({
            ok: false,
            msg: "Error en el servidor"
        });  
    }
     
   
}


export const revalidarToken = async( req, res = response ) => {

  const uid = req.uid
  const name = req.name

  // Generar Nuestro JWT  
    const token = await generarJWT( uid, name )

  
  res.json({
      ok:true,
      token,
      msg: 'Pagina de Revalidar token'
  })
}

