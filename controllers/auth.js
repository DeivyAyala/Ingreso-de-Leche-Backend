import {response} from 'express'
import bcrypt from 'bcryptjs';
import Usuario from '../models/Usuario.js'
import { generarJWT } from '../helpers/jwt.js';


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
      user: {
        uid: usuario.id,
        name: usuario.name,
        lastName: usuario.lastName,
        email: usuario.email,
        rol: usuario.rol
      },
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


export const loginUsuario = async (req, res = response) => {
  try {
    const { email, password } = req.body;

    // 🔎 Verificar si existe el correo
    let usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario no existe con ese email"
      });
    }

    // 🔐 Validar Password
    const validPassword = bcrypt.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Contraseña incorrecta"
      });
    }

    // 🎫 Generar JWT
    const token = await generarJWT(usuario.id, usuario.name);

    // 📦 Respuesta estructurada
    res.json({
      ok: true,
      user: {
        uid: usuario.id,
        name: usuario.name,
        lastName: usuario.lastName,
        email: usuario.email,
        rol: usuario.rol
      },
      token
    });

  } catch (error) {
    console.error("❌ Error en loginUsuario:", error);
    res.status(500).json({
      ok: false,
      msg: "Error en el servidor"
    });
  }
};



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

