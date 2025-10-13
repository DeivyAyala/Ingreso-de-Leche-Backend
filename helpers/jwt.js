import jwt from 'jsonwebtoken'
const { sign } = jwt


export const generarJWT = (uid, name) => {
    return new Promise (( resolve, reject ) => {
        const payload = {uid, name}
        sign(payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '2h' 
        }, (err, token)=>{
            if(err){
                console.log(err)
                reject('No se Pudo Generar el Token')
            }
            resolve(token)
        })
    } ) 
}

