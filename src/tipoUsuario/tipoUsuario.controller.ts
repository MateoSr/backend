import { getTiposUsuario, getTipoUsuario } from "./tipoUsuario.service.js"
import { type Request, type Response } from "express"
import { asegurarEncontrado } from "../shared/errors.js"

async function obtenerTiposUsuario(req: Request, res: Response) {
    const tiposUsuario = await getTiposUsuario()
    return res.status(200).json(tiposUsuario)
}

async function obtenerTipoUsuario(req: Request, res: Response) {
    const {id} = req.params
    const tipoUsuario = asegurarEncontrado(
        await getTipoUsuario(Number(id)),
        "el tipo de usuario"
    )
    return res.status(200).json(tipoUsuario)
}

export {
    obtenerTiposUsuario,
    obtenerTipoUsuario
}
