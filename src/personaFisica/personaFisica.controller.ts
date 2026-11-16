import { getAllPersonasFisicas, getPersonaFisicaDni, postPersonaFisica, deletePersonaFisica, putPersonaFisica} from "./personaFisica.service.js"
import { type Request, type Response } from "express";
import { errores, asegurarEncontrado } from "../shared/errors.js";

async function obtenerPersonasFisicas(req: Request, res: Response) {
    const personasFisicas = await getAllPersonasFisicas()
    return res.status(200).json(personasFisicas)
}

async function obtenerPersonaFisica(req: Request, res: Response) {
    const dni = req.params.dni as string
    const personaFisica = asegurarEncontrado(await getPersonaFisicaDni(dni), "la persona")
    return res.status(200).json(personaFisica)
}

async function crearPersonaFisica(req: Request, res: Response) {
    const personaFisica = req.body
    const resultado = await postPersonaFisica(personaFisica)

    return res.status(201).json({
        message: 'Persona creada correctamente',
        personaFisica: resultado
    })
}

async function modificarPersonaFisica(req: Request, res: Response) {
    const dni = req.params.dni as string
    const personaFisicaModificada = req.body
    const resultado = await putPersonaFisica(dni, personaFisicaModificada)

    if (!resultado) {
        throw errores.noEncontrado("la persona")
    }

    return res.status(200).json({
        message: 'Persona modificada correctamente',
        personaFisica: resultado // Devolvemos el registro guardado en la base de datos
    })
}

async function borrarPersonaFisica(req: Request, res: Response) {
    const dni = req.params.dni as string
    const response = await deletePersonaFisica(dni)

    if (!response) {
        throw errores.noEncontrado("la persona")
    }

    return res.status(200).json({
        message: 'Persona eliminada correctamente',
    })
}

export {
    obtenerPersonasFisicas,
    obtenerPersonaFisica,
    crearPersonaFisica,
    borrarPersonaFisica,
    modificarPersonaFisica
};
