import {getAllUsers,getClientes,getUserId,postUser,deleteUser,putUser} from "./users.service.js"
import {getPersonaFisicaDni} from "../personaFisica/personaFisica.service.js";
import { userResponseSchema } from "./users.schema.js";
import { type Request, type Response } from "express";
import { errores, asegurarEncontrado } from "../shared/errors.js";

async function obtenerUsers(req:Request,res:Response) {
    const users = await getAllUsers()
    return res.status(200).json(userResponseSchema.array().parse(users))
}

async function obtenerClientes(req:Request,res:Response) {
    if (req.usuario?.rol !== "Encargado") {
        throw errores.prohibido("Solo un encargado puede consultar clientes")
    }

    return res.status(200).json(await getClientes())
}

async function obtenerUser(req:Request,res:Response) {
    const {id} = req.params
    const user = asegurarEncontrado(await getUserId(Number(id)), "el usuario")
    return res.status(200).json(userResponseSchema.parse(user))
}

async function obtenerUserCompleto(req:Request,res:Response) {
    const userId = req.usuario?.userId;
    if (!userId) {
        throw errores.noAutorizado("Usuario no autenticado en la petición")
    }

    const user = asegurarEncontrado(await getUserId(Number(userId)), "el usuario")
    const personaFisica = asegurarEncontrado(
        await getPersonaFisicaDni(user.personaFisicaDni!),
        "la persona"
    )

    const respuesta = {
        "id":user.id,
        "nombre":personaFisica.nombre,
        "apellido":personaFisica.apellido,
        "email":user.email,
        "telefono":user.telefono,
        fechaNacimiento: personaFisica.fechaNacimiento ? new Date(personaFisica.fechaNacimiento).toISOString().split('T')[0] : ""
    }
    return res.status(200).json(respuesta)
}

async function crearUser(req:Request,res:Response) {
    const user = req.body
    const resultado = await postUser(user)
    if(!resultado){
        throw errores.errorInterno("No se pudo crear el usuario")
    }
    return res.status(201).json({
        message: 'Usuario creado correctamente',
        user: userResponseSchema.parse(resultado)
    })
}

async function modificarUser(req:Request,res:Response) {
    const userId = req.usuario?.userId;

    if (!userId) {
        throw errores.noAutorizado("Usuario no autenticado en la petición")
    }

    const userModificado = req.body
    const resultado = await putUser(Number(userId),userModificado)
    if(!resultado){
        throw errores.noEncontrado("el usuario")
    }
    return res.status(200).json({
        message: 'Usuario modificado correctamente',
        user: userResponseSchema.parse(resultado)
    })
}

async function borrarUser(req:Request,res:Response) {
    const {id} = req.params
    const response = await deleteUser(Number(id))
    if(!response){
        throw errores.noEncontrado("el usuario")
    }
    return res.status(200).json({
        message: 'Usuario eliminado correctamente',
    })
}

export {
  obtenerUsers,
    obtenerClientes,
  obtenerUser,
  crearUser,
  borrarUser,
  modificarUser,
  obtenerUserCompleto
};
