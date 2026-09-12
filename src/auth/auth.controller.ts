import {postUser,getUserEmail} from '../usuario/users.service.js'
import {getPersonaFisicaDni,postPersonaFisica} from '../personaFisica/personaFisica.service.js'
import { ZodError } from 'zod';
import { type Request, type Response } from "express";
import {enviarEmailResetPassword, login, loginAdmin, resetPassword} from './auth.service.js' 


async function iniciarSesion(req: Request, res: Response) {
    try {
        const { email, password } = req.body;
        const token = await login(String(email), String(password));
        console.log(token)
        return res.json({
            message:"Login exitoso",
            token: token
        })
    }catch(error:any){
        res.status(400).json({error:error.message})
    }
}

async function iniciarSesionAdmin(req: Request, res: Response) {
    try {
        const { email, password } = req.body;
        const token = await loginAdmin(String(email), String(password));
        console.log(token)
        return res.json({
            message:"Login exitoso",
            token: token
        })
    }catch(error:any){
        res.status(400).json({error:error.message})
    }
}

async function registrar(req: Request, res: Response) {
    try{
        const {email,password,telefono,dni,nombre,apellido,fechaNacimiento} =req.body
      
        const user = {
            personaFisicaDni:dni,
            email:email,
            password:password,
            telefono:telefono,
            tipoUsuarioId:4
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

async function resetearPassword(req: Request, res: Response) {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: "El token y la nueva contraseña son requeridos." });
    }

    if (password.trim().length < 8) {
      return res.status(400).json({ message: "La contraseña es muy corta." });
    }

    const respuesta = await resetPassword(String(token), String(password));

    if (!respuesta) {
      return res.status(400).json({ message: "El enlace es inválido o ha expirado." });
    }

    return res.status(200).json({ message: "Contraseña actualizada correctamente." });
  } catch (error: any) {
    return res.status(500).json({ message: "Error al actualizar la contraseña." });
  }
}
 
export  {iniciarSesion, iniciarSesionAdmin, registrar, olvidePassword,resetearPassword}