import { response } from "express"
import jwt from 'jsonwebtoken'

export const validarjwt = (req, res = response, next) => {
    // x-token headers
    const token = req.header('x-token')

    if(!token){
        return res.status(401).json({
            ok: false,
            msg: 'No Hay token en la petición'
        });
    }

    try {
        const payload = jwt.verify(
            token,
            process.env.SECRET_JWT_SEED
        );

        // console.log(payload)
        req.uid = payload.uid
        req.name = payload.name
        
    } catch (err) {
        return res.status(401).json({
            ok:false,
            msg: 'Token no Valido'
        })
    }
    
    next()
}   