import { response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import Usuario from "../models/Usuario.js";
import { generarJWT } from "../helpers/jwt.js";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../helpers/email.js";

const createVerifyToken = () => {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return { rawToken, tokenHash, expires };
};

const createResetToken = () => {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  const expires = new Date(Date.now() + 15 * 60 * 1000);
  return { rawToken, tokenHash, expires };
};

export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().select("-password");
    return res.json({
      ok: true,
      usuarios,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      msg: "Error al obtener usuarios",
    });
  }
};

export const crearUsuario = async (req, res = response) => {
  try {
    const { name, lastName, email, password, phone, rol } = req.body;

    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({
        ok: false,
        msg: "El correo ya está registrado",
      });
    }

    const rolFinal = rol ? rol : "Operador";
    const { rawToken, tokenHash, expires } = createVerifyToken();

    const usuario = new Usuario({
      name,
      lastName,
      email,
      password,
      phone,
      rol: rolFinal,
      isVerified: false,
      verifyTokenHash: tokenHash,
      verifyTokenExpires: expires,
    });

    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    await usuario.save();

    try {
      await sendVerificationEmail({
        email: usuario.email,
        name: usuario.name,
        token: rawToken,
      });
    } catch (error) {
      console.error("Error enviando correo de verificación:", error);
    }

    return res.status(201).json({
      ok: true,
      msg: "Usuario creado. Revisa tu correo para verificar la cuenta.",
    });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error en el servidor",
    });
  }
};

export const crearUsuarioAdmin = async (req, res) => {
  try {
    const { name, lastName, email, password, phone, rol } = req.body;

    const existe = await Usuario.findOne({ email });
    if (existe) {
      return res.status(400).json({
        ok: false,
        msg: "El correo ya está registrado",
      });
    }

    const { rawToken, tokenHash, expires } = createVerifyToken();

    const usuario = new Usuario({
      name,
      lastName,
      email,
      password,
      phone,
      rol: rol || "Operador",
      isVerified: false,
      verifyTokenHash: tokenHash,
      verifyTokenExpires: expires,
    });

    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    await usuario.save();

    try {
      await sendVerificationEmail({
        email: usuario.email,
        name: usuario.name,
        token: rawToken,
      });
    } catch (error) {
      console.error("Error enviando correo de verificación:", error);
    }

    res.status(201).json({
      ok: true,
      msg: "Usuario creado. Se envió correo de verificación.",
    });
  } catch (error) {
    console.error("Error crearUsuarioAdmin:", error);
    res.status(500).json({
      ok: false,
      msg: "Error en el servidor",
    });
  }
};

export const editarUsuarioAdmin = async (req, res = response) => {
  const usuarioId = req.params.id;

  try {
    const existe = await Usuario.findById(usuarioId);

    if (!existe) {
      return res.status(404).json({
        ok: false,
        msg: "El usuario no existe por ese ID",
      });
    }

    const datosActualizados = {
      ...req.body,
    };

    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      usuarioId,
      datosActualizados,
      { new: true }
    );

    res.json({
      ok: true,
      msg: "Usuario actualizado correctamente",
      usuario: usuarioActualizado,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      msg: "Error al actualizar usuario",
    });
  }
};

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

    if (req.uid === usuarioId) {
      return res.status(400).json({
        ok: false,
        msg: "No puedes eliminar tu propia cuenta",
      });
    }

    await Usuario.findByIdAndDelete(usuarioId);

    return res.json({
      ok: true,
      msg: "Usuario eliminado correctamente",
    });
  } catch (error) {
    console.error("Error eliminarUsuarioAdmin:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error en el servidor",
    });
  }
};

export const loginUsuario = async (req, res = response) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario no existe con ese email",
      });
    }

    if (!usuario.isVerified) {
      return res.status(401).json({
        ok: false,
        msg: "Cuenta no verificada. Revisa tu correo.",
      });
    }

    const validPassword = bcrypt.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Contraseña incorrecta",
      });
    }

    const token = await generarJWT(usuario.id, usuario.name);

    res.json({
      ok: true,
      user: {
        id: usuario.id,
        name: usuario.name,
        lastName: usuario.lastName,
        email: usuario.email,
        phone: usuario.phone,
        rol: usuario.rol,
        imageUrl: usuario.imageUrl,
      },
      token,
    });
  } catch (error) {
    console.error("Error en loginUsuario:", error);
    res.status(500).json({
      ok: false,
      msg: "Error en el servidor",
    });
  }
};

export const revalidarToken = async (req, res = response) => {
  try {
    const uid = req.uid;
    const name = req.name;

    const usuario = await Usuario.findById(uid).select("-password");

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no encontrado",
      });
    }

    if (!usuario.isVerified) {
      return res.status(401).json({
        ok: false,
        msg: "Cuenta no verificada. Revisa tu correo.",
      });
    }

    const token = await generarJWT(uid, name);

    res.json({
      ok: true,
      user: {
        uid: usuario.id,
        name: usuario.name,
        lastName: usuario.lastName,
        phone: usuario.phone,
        email: usuario.email,
        rol: usuario.rol,
        imageUrl: usuario.imageUrl,
      },
      token,
    });
  } catch (error) {
    console.error("Error en revalidarToken:", error);
    res.status(500).json({
      ok: false,
      msg: "Error en el servidor",
    });
  }
};

export const verificarCorreo = async (req, res = response) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        ok: false,
        msg: "Token requerido",
      });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const usuario = await Usuario.findOne({
      verifyTokenHash: tokenHash,
      verifyTokenExpires: { $gt: new Date() },
    });

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: "Token inválido o expirado",
      });
    }

    usuario.isVerified = true;
    usuario.verifyTokenHash = undefined;
    usuario.verifyTokenExpires = undefined;
    await usuario.save();

    return res.json({
      ok: true,
      msg: "Correo verificado correctamente",
    });
  } catch (error) {
    console.error("Error al verificar correo:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error en el servidor",
    });
  }
};

export const solicitarRecuperacionPassword = async (req, res = response) => {
  try {
    const { email } = req.body;

    const usuario = await Usuario.findOne({ email });

    // Respuesta genérica para no filtrar correos válidos
    const genericResponse = {
      ok: true,
      msg: "Si el correo existe, recibirás instrucciones para recuperar tu contraseña.",
    };

    if (!usuario) {
      return res.json(genericResponse);
    }

    const { rawToken, tokenHash, expires } = createResetToken();

    usuario.resetPasswordTokenHash = tokenHash;
    usuario.resetPasswordExpires = expires;
    await usuario.save();

    try {
      await sendPasswordResetEmail({
        email: usuario.email,
        name: usuario.name,
        token: rawToken,
      });
    } catch (error) {
      console.error("Error enviando correo de recuperación:", error);
    }

    return res.json(genericResponse);
  } catch (error) {
    console.error("Error al solicitar recuperación:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error en el servidor",
    });
  }
};

export const restablecerPassword = async (req, res = response) => {
  try {
    const { token, password } = req.body;

    if (!token) {
      return res.status(400).json({
        ok: false,
        msg: "Token requerido",
      });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const usuario = await Usuario.findOne({
      resetPasswordTokenHash: tokenHash,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: "Token inválido o expirado",
      });
    }

    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);
    usuario.resetPasswordTokenHash = undefined;
    usuario.resetPasswordExpires = undefined;
    await usuario.save();

    return res.json({
      ok: true,
      msg: "Contraseña actualizada correctamente",
    });
  } catch (error) {
    console.error("Error al restablecer contraseña:", error);
    return res.status(500).json({
      ok: false,
      msg: "Error en el servidor",
    });
  }
};
