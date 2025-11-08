import { response } from 'express'
import jwt from 'jsonwebtoken'

export const validarjwt = (req, res = response, next) => {
  // Buscar el token en Authorization o en x-token
  let token = null

  // 1️⃣ Primero intenta leer el formato estándar
  const authHeader = req.header('Authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1] // extrae solo el token
  }

  // 2️⃣ Si no se envió Authorization, intenta con x-token
  if (!token) {
    token = req.header('x-token')
  }

  // 3️⃣ Si no hay token en ninguno, retorna error
  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: 'No hay token en la petición',
    })
  }

  try {
    // Verifica el token con tu clave secreta
    const payload = jwt.verify(token, process.env.SECRET_JWT_SEED)

    // Añade los datos del usuario al request
    req.uid = payload.uid
    req.name = payload.name
  } catch (err) {
    return res.status(401).json({
      ok: false,
      msg: 'Token no válido',
    })
  }

  next()
}
