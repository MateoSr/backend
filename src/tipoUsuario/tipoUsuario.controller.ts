import { getTiposUsuario, getTipoUsuario } from "./tipoUsuario.service.js"
import { type Request, type Response } from "express"

async function obtenerTiposUsuario(req: Request, res: Response) {
    try {
        const tiposUsuario = await getTiposUsuario()
        if(!tiposUsuario){
            return res.status(404).json({message: "No se encontraron tipos de usuario"})
        }
        return res.status(200).json(tiposUsuario)
    } catch (error:any) {
        return res.status(500).json({message: error.message})
    }
}

async function obtenerTipoUsuario(req: Request, res: Response) {
    try {
        const {id} = req.params
        const tipoUsuario = await getTipoUsuario(Number(id))
        if(!tipoUsuario){
            return res.status(404).json({message: "No se encontro el tipo de usuario"})
        }
        return res.status(200).json(tipoUsuario)
    } catch (error:any) {
        return res.status(500).json({message: error.message})
    }
}

export {
    obtenerTiposUsuario,
    obtenerTipoUsuario
}