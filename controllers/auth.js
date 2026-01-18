import {response} from 'express'
import bcrypt from 'bcryptjs';
import Usuario from '../models/Usuario.js'
import { generarJWT } from '../helpers/jwt.js';


export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-password');
    return res.json({
      ok: true,
      usuarios,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ 
      ok: false,
      msg: 'Error al obtener usuarios' 
    });
  }
};

export const crearUsuario = async (req, res = response) => {
  try {
    const { name, lastName, email, password, phone, rol } = req.body;

    //Verificar si ya existe el correo
    let usuario = await Usuario.findOne({ email });
    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: "El correo ya está registrado"
      });
    }

    // Asignar rol por defecto (Operador)
   const rolFinal = rol ? rol : "Operador";

    // Crear usuario
    usuario = new Usuario({ name, lastName, email, password, phone, rol: rolFinal });

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
        phone: usuario.phone,
        rol: usuario.rol, // ← Esto devuelve "Operador"
        imageUrl: usuario.imageUrl
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

export const crearUsuarioAdmin = async (req, res) => {

  try {
    const { name, lastName, email, password, phone, rol } = req.body;

  // Verificar email duplicado
  const existe = await Usuario.findOne({ email });
    if (existe) {
      return res.status(400).json({
        ok: false,
        msg: "El correo ya está registrado",
      });
  }

  const usuario = new Usuario({
    name,
    lastName,
    email,
    password,
    phone,
    rol: rol || "Operador",
  });

  const salt = bcrypt.genSaltSync();
  usuario.password = bcrypt.hashSync(password, salt);

  await usuario.save();

  res.status(201).json({
    ok: true,
    user: {
      _id: usuario.id,
      name: usuario.name,
      email: usuario.email,
      rol: usuario.rol
    }
  });
  } catch (error) {
    console.error("❌ Error crearUsuarioAdmin:", error);
    res.status(500).json({
      ok: false,
      msg: "Error en el servidor",
    });
  }
  
};


export const editarUsuarioAdmin = async(req, res = response) => {
  const usuarioId = req.params.id

  try {
    const existe = await Usuario.findById(usuarioId)

    if(!existe) {
      return res.status(404).json({
        ok: false,
        msg: "El Usuario no existe cpor ese ID",
      })
    }

    const datosActualizados = {
      ...req.body
    }

    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      usuarioId,
      datosActualizados,
      { new: true }
    )

    res.json({
      ok: true,
      msg:"Usuario Actualizado Correctamente",
      usuario: usuarioActualizado
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({
      ok: false,
      msg: "Error al Actualizar Usuario"
    })
  }

}


export const eliminarUsuarioAdmin = async (req, res) => {
  const usuarioId = req.params.id;

  try {
    
    const usuario = await Usuario.findById(usuarioId);

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no encontrado",
      });
    }

    // 🚫 (Opcional) Evitar que un admin se elimine a sí mismo
    if (req.uid === usuarioId) {
      return res.status(400).json({
        ok: false,
        msg: "No puedes eliminar tu propia cuenta",
      });
    }

    // 🗑️ Eliminar usuario
    await Usuario.findByIdAndDelete(usuarioId);

    return res.json({
      ok: true,
      msg: "Usuario eliminado correctamente",
    });

  } catch (error) {
    console.error("❌ Error eliminarUsuarioAdmin:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error en el servidor",
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
        id: usuario.id,
        name: usuario.name,
        lastName: usuario.lastName,
        email: usuario.email,
        phone: usuario.phone,
        rol: usuario.rol,
        imageUrl: usuario.imageUrl
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
        phone: usuario.phone, 
        email: usuario.email,
        rol: usuario.rol,
        imageUrl: usuario.imageUrl
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


