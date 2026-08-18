import {postUser, validarUser,getUserEmail} from '../usuario/users.service.js'
import {getPersonaFisicaDni,postPersonaFisica} from '../personaFisica/personaFisica.service.js'
import { ZodError } from 'zod';
import { type Request, type Response } from "express";
import {enviarEmailResetPassword, resetPassword} from './auth.service.js' 



async function iniciarSesion(req: Request, res: Response) {
    try{
        const {email,password} = req.body
        const response = await validarUser(String(email),String(password))
        if(!response){
            return res.status(404).json({message:"Credenciales Invalidas"})
        }
        return res.status(200).json({message:"Login exitoso"})

    }catch(error:any){
        return res.status(400).json({error:error.message})
    }
    
}

async function registrar(req: Request, res: Response) {
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
    }catch(error:any){
        if (error instanceof ZodError) {
        return res.status(400).json({
            message: "Error de validación en los datos ingresados",})
        }
        return res.status(400).json({error:error.message})
    }
    
}

async function olvidePassword(req:Request,res:Response) {
    try{
        const {email} = req.body
        if(!email){
            return res.status(400).json({message:"Email es requerido"})
        }
        // console.log(email)
        const response = await getUserEmail(String(email))
        if(!response){
            return res.status(404).json({message: "Email no encontrado"})
        }

        await enviarEmailResetPassword(email,response.id)
        return res.status(200).json({ message: "Se ha enviado un correo con las instrucciones para restablecer tu contraseña" })


    }catch(error:any){
        return res.status(500).json({error:error.message})
    }
    
}

async function resetearPassword(req:Request,res:Response) {
    try{
        const {id,password} = req.body
        if (!id || !password) {
            return res.status(400).json({ message: "El ID y la nueva contraseña son requeridos." });
            }
        if(password.trim().length < 8){
            return res.status(400).json({ message: "La contraseña es muy corta" });
        }
        const respuesta = await resetPassword(Number(id),String(password))
        if(!respuesta){
            return res.status(400).json({message:"Usuario no encontrado"})
        }
        return res.status(200).json({message:"Usuario actualizado"})
    }catch(error:any){
        return res.status(500).json({message:"Error al actualizar"})
    }
}
 
export  {iniciarSesion, registrar, olvidePassword,resetearPassword}