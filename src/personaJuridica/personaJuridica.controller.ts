import { getAllPersonasJuridicas, getPersonaJuridicaCuit, postPersonaJuridica, deletePersonaJuridica, putPersonaJuridica} from "./personaJuridica.service.js"
import { type Request, type Response } from "express";
import { errores, asegurarEncontrado } from "../shared/errors.js";

async function obtenerPersonasJuridicas(req: Request, res: Response) {
    const personasJuridicas = await getAllPersonasJuridicas()
    return res.status(200).json(personasJuridicas)
}

async function obtenerPersonaJuridica(req: Request, res: Response) {
    const cuit = req.params.cuit as string;
    const personaJuridica = asegurarEncontrado(
        await getPersonaJuridicaCuit(cuit),
        "la empresa"
    )
    return res.status(200).json(personaJuridica)
}

async function crearPersonaJuridica(req: Request, res: Response) {
    const personaJuridica = req.body
    const resultado = await postPersonaJuridica(personaJuridica)

    return res.status(201).json({
        message: 'Empresa creada correctamente',
        personaJuridica: resultado
    })
}

async function modificarPersonaJuridica(req: Request, res: Response) {
    const cuit = req.params.cuit as string;
    const personaJuridicaModificada = req.body

    const resultado = await putPersonaJuridica(cuit, personaJuridicaModificada)

    if (!resultado) {
        throw errores.noEncontrado("la empresa")
    }
    return res.status(200).json({
        message: 'Empresa modificada correctamente',
        personaJuridica: resultado
    })
}

async function borrarPersonaJuridica(req: Request, res: Response) {
    const cuit = req.params.cuit as string;

    const response = await deletePersonaJuridica(cuit)
    if (!response) {
        throw errores.noEncontrado("la empresa")
    }
    return res.status(200).json({
        message: 'Empresa eliminada correctamente',
    })
}

export {
    obtenerPersonasJuridicas,
    obtenerPersonaJuridica,
    crearPersonaJuridica,
    borrarPersonaJuridica,
    modificarPersonaJuridica
};
