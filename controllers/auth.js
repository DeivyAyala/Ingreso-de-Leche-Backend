import {response} from 'express'
import {validationResult} from 'express-validator'



export const crearUsuario = (req, res = response) => {
const {name, lastName, rol, email, password} = req.body;
    //Manejo de errores
    const errors = validationResult( req )

    console.log(errors)
    if(!errors.isEmpty()){
        return res.status(400).json({
            ok:false,
            errors: errors.mapped()
        })
    }

    res.status(201).json({
        ok:true,
        msg: 'Pagina de Registro',
        name,
        lastName,
        rol,
        email, 
        password
    })
}


export const loginUsuario = (req, res = response) => {
    const { email, password} = req.body;
    const errors = validationResult( req )
    console.log(errors)

    if(!errors.isEmpty()){
        return res.status(400).json({
            ok: false,
            errors: errors.mapped()
        })
    }

    res.json({
        ok:true,
        msg: 'Pagina de Iniciar Sesion',
        email,
        password
    })
}


export const revalidarToken = ( req, res = response ) => {
    res.json({
        ok:true,
        msg: 'Pagina de Recuperar contraseña'
    })
}

