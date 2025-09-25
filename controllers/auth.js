import {response} from 'express'


export const crearUsuario = (req, res = response) => {
const {name, lastName, rol, email, password} = req.body;
    //Manejo de errores

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

