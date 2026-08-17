import {getAllUsers,getUserId,postUser,deleteUser,putUser} from "./users.service.js"
import {getPersonaFisicaDni} from "../personaFisica/personaFisica.service.js";
import { ZodError } from 'zod'; //modulo que permimte mostrar los errores de tipos de datos
import { type Request, type Response } from "express";

async function obtenerUsers(req:Request,res:Response) {
    try{
        const users = await getAllUsers()
        return res.status(200).json(users)
        }catch(error:any){
        return res.status(400).json({error:error.message})
    }
}

async function obtenerUser(req:Request,res:Response) {
    try{
        const {id} = req.params
        const user = await getUserId(Number(id))
        if(!user){
            return res.status(404).json({message:"No se encontro el usuario"})
        }
        return res.status(200).json(user)
        }catch(error:any)
        {
        return res.status(400).json({error:error.message})
        }
}

async function obtenerUserCompleto(req:Request,res:Response) {
    try{
        const {id} = req.params
        const user = await getUserId(Number(id))
        if(!user){
            return res.status(404).json({message:"No se encontro el usuario"})
        }
        const personaFisica = await getPersonaFisicaDni(user.dni)
        if(!personaFisica){
            return res.status(404).json({message:"No se encontro la persona"})
        }

        const respuesta = {
            "id":user.id,
            "nombre":personaFisica.nombre,
            "apellido":personaFisica.apellido,
            "email":user.email,
            // "password":user.password,
            "telefono":user.telefono,
            "fechaNacimiento":personaFisica.fechaNacimiento
        }
        return res.status(200).json(respuesta)

    }catch(error:any)
        {
        return res.status(400).json({error:error.message})
        }
}

async function crearUser(req:Request,res:Response) {
    try{
        const user = req.body
        const resultado = await postUser(user)
        if(!resultado){
            return res.status(401).json({
                error: 'Erorr'
            })
        }
        return res.status(201).json({
            message: 'Usuario creado correctamente',
            user: resultado
        })

        }catch(error:any)
        {
        if (error instanceof ZodError) {
        return res.status(400).json({
            message: "Error de validación en los datos ingresados",
            detalles: error.issues});
        }
        return res.status(400).json({error:error.message})
        }
}

async function modificarUser(req:Request,res:Response) {
    try{
        const {id} = req.params
        const userModificado = req.body
        const resultado = await putUser(Number(id),userModificado)
        if(!resultado){
            return res.status(404).json({message:"No se encontro el usuario"})
        }
        return res.status(200).json({
            message: 'Usuario modificado correctamente',
            user: userModificado
        })
        }catch(error:any)
        {
        return res.status(400).json({error:error.message})
        }
}

async function borrarUser(req:Request,res:Response) {
    try{
        const {id} = req.params
        const response = await deleteUser(Number(id))
        if(!response){
            return res.status(404).json({message:"No se encontro el usuario"})
        }
        return res.status(200).json({
            message: 'Usuario eliminado correctamente',
        })
        }catch(error:any)
        {
        return res.status(400).json({error:error.message})
        }
}

async function modificarUserCompleto(req:Request,res:Response) {
    try{
        const {id} = req.params
        const datosModificados = req.body
        console.log(datosModificados)
        return res.status(200).json({
            message: 'Usuario modificado correctamente',
            user: datosModificados
        })

    }catch(error:any)
    {
        return res.status(400).json({error:error.message})
    }
}



export {
  obtenerUsers,
  obtenerUser,
  crearUser,
  borrarUser,
  modificarUser,
  modificarUserCompleto,
  obtenerUserCompleto
};