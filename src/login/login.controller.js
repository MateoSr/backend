import {postUser, validarUser} from '../usuario/users.service.js'


async function iniciarSesion(req,res) {
    try{
        const {email,password} = req.body
        const response = await validarUser(email,password)
        if(!response){
            return res.status(404).json({message:"Credenciales Invalidas"})
        }
        return res.status(200).json({message:"Login exitoso"})

    }catch(error){
        return res.status(400).json({error:error.message})
    }
    
}

export default iniciarSesion