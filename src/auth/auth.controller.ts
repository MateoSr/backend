import {postUser,getUserEmail} from '../usuario/users.service.js'
import {getPersonaFisicaDni,postPersonaFisica} from '../personaFisica/personaFisica.service.js'
import { type Request, type Response } from "express";
import { userResponseSchema } from '../usuario/users.schema.js';
import {enviarEmailResetPassword, login, refrescarToken, resetPassword} from './auth.service.js'
import { errores } from '../shared/errors.js';


async function iniciarSesion(req: Request, res: Response) {
    const { email, password } = req.body;
    const token = await login(String(email), String(password));

    return res.json({
        message:"Login exitoso",
        token: token
    })
}

async function refrescarSesion(req: Request, res: Response) {
    const { refreshToken } = req.body;
    const tokens = await refrescarToken(String(refreshToken ?? ''));

    return res.json({
        message: "Sesión renovada",
        token: tokens
    })
}

async function registrar(req: Request, res: Response) {
    const {email,password,telefono,dni,nombre,apellido,fechaNacimiento} =req.body

    const user = {
        personaFisicaDni:dni,
        email:email,
        password:password,
        telefono:telefono,
        tipoUsuarioId:3
    }

    const persona = {
        dni:dni,
        nombre:nombre,
        apellido:apellido,
        fechaNacimiento:fechaNacimiento
    }

    //busco persona para ver si existe
    const findPersona = await getPersonaFisicaDni(persona.dni)
    if(findPersona == null){
        // si no existe creo
        await postPersonaFisica(persona)
    }
    const creado = await postUser(user)

    return res.status(201).json({
        message:"Usuario registrado con éxito",
        user: userResponseSchema.parse(creado)
    })
}

async function olvidePassword(req:Request,res:Response) {
    const {email} = req.body
    if(!email){
        throw errores.solicitudInvalida("Email es requerido")
    }
    const response = await getUserEmail(String(email))
    if(!response){
        throw errores.noEncontrado("el email")
    }

    await enviarEmailResetPassword(email,response.id)
    return res.status(200).json({ message: "Se ha enviado un correo con las instrucciones para restablecer tu contraseña" })
}

async function resetearPassword(req: Request, res: Response) {
    const { token, password } = req.body;

    if (!token || !password) {
        throw errores.solicitudInvalida("El token y la nueva contraseña son requeridos.")
    }

    if (password.trim().length < 8) {
        throw errores.solicitudInvalida("La contraseña es muy corta.")
    }

    const respuesta = await resetPassword(String(token), String(password));

    if (!respuesta) {
        throw errores.solicitudInvalida("El enlace es inválido o ha expirado.")
    }

    return res.status(200).json({ message: "Contraseña actualizada correctamente." });
}

export  {iniciarSesion, refrescarSesion, registrar, olvidePassword,resetearPassword}
