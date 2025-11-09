import {response} from 'express'
import bcrypt from 'bcryptjs';
import Usuario from '../models/Usuario.js'
import { generarJWT } from '../helpers/jwt.js';


export const crearUsuario = async (req, res = response) => {
  try {
    const { name, lastName, email, password } = req.body;

    //Verificar si ya existe el correo
    let usuario = await Usuario.findOne({ email });
    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: "El correo ya está registrado"
      });
    }

    // Asignar rol por defecto (Operador)
    const rol = "Operador";

    // Crear usuario
    usuario = new Usuario({ name, lastName, email, password, rol });

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    // Guardar usuario
    await usuario.save();

    // Generar JWT
    const token = await generarJWT(usuario.id, usuario.name);

    // Respuesta con el usuario creado y su rol
    return res.status(201).json({
      ok: true,
      user: {
        uid: usuario.id,
        name: usuario.name,
        lastName: usuario.lastName,
        email: usuario.email,
        rol: usuario.rol, // ← Esto devuelve "Operador"
      },
      token
    });

  } catch (error) {
    console.error("❌ Error al crear usuario:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error en el servidor"
    });
  }
};



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



export const revalidarToken = async (req, res = response) => {
  try {
    const uid = req.uid;
    const name = req.name;

    //Buscar al usuario en la base de datos (sin mostrar la contraseña)
    const usuario = await Usuario.findById(uid).select('-password');

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no encontrado",
      });
    }

    //Generar nuevo token
    const token = await generarJWT(uid, name);

    // Respuesta con datos del usuario y nuevo token
    res.json({
      ok: true,
      user: {
        uid: usuario.id,
        name: usuario.name,
        lastName: usuario.lastName,
        email: usuario.email,
        rol: usuario.rol,
      },
      token,
    });
  } catch (error) {
    console.error("❌ Error en revalidarToken:", error);
    res.status(500).json({
      ok: false,
      msg: "Error en el servidor",
    });
  }
};


