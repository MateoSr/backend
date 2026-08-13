import {postUser, validarUser,getUserEmail} from '../usuario/users.service.js'
import {getPersonaFisicaDni,postPersonaFisica} from '../personaFisica/personaFisica.service.js'
import { ZodError } from 'zod';



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

async function registrar(req,res) {
    try{
        const {email,password,telefono,dni,nombre,apellido,fechaNacimiento} =req.body
        const user = {
            dni:dni,
            email:email,
            password:password,
            telefono:telefono,
            id_tipoUsuario:2
        }

        const persona ={
            dni:dni,
            nombre:nombre,
            apellido:apellido,
            fechaNacimiento:fechaNacimiento
        }

        //verificamos si el email esta usado
        // const busquedaPorEmail = await getUserEmail(user.email)
        // if(busquedaPorEmail){
        //     return res.status(400).json({message:"El email ya esta usado"})
        // }

        //busco persona para ver si existe
        const findPersona = await getPersonaFisicaDni(persona.dni)
        if(findPersona == null){
            // si no existe creo
            const creacionPersona = await postPersonaFisica(persona)
        }
        const response = await postUser(user)
        return res.status(201).json({message:"Usuario registrado con exito"})
    }catch(error){
        if (error instanceof ZodError) {
        return res.status(400).json({
            message: "Error de validación en los datos ingresados",})
        }
        return res.status(400).json({error:error.message})
    }
    
}

export  {iniciarSesion, registrar}