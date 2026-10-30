import { getAllPersonasJuridicas, getPersonaJuridicaCuit, postPersonaJuridica, deletePersonaJuridica, putPersonaJuridica} from "./personaJuridica.service.js"
import { ZodError } from 'zod';
import { type Request, type Response } from "express";

async function obtenerPersonasJuridicas(req: Request, res: Response) {
    try {
        const personasJuridicas = await getAllPersonasJuridicas()

        if (personasJuridicas.length === 0) {
            return res.status(404).json({ message: "No hay empresas registradas" })
        }

        return res.status(200).json(personasJuridicas)
    } catch (error: any) {
        return res.status(500).json({ error: error.message })
    }
}

async function obtenerPersonaJuridica(req: Request, res: Response) {
    try {
        const cuit = req.params.cuit as string; 
        
        const personaJuridica = await getPersonaJuridicaCuit(cuit)
        if (!personaJuridica) {
            return res.status(404).json({ message: "No se encontró la empresa" })
        }
        return res.status(200).json(personaJuridica)
    } catch (error: any) {
        return res.status(500).json({ error: error.message })
    }
}

async function crearPersonaJuridica(req: Request, res: Response) {
    try {
        const personaJuridica = req.body
        const resultado = await postPersonaJuridica(personaJuridica)
        
        return res.status(201).json({
            message: 'Empresa creada correctamente',
            personaJuridica: resultado
        })
    } catch (error: any) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                message: "Error de validación en los datos ingresados",
                detalles: error.issues 
            })
        }
        return res.status(500).json({ error: error.message })
    }
}

async function modificarPersonaJuridica(req: Request, res: Response) {
    try {
        const cuit = req.params.cuit as string;
        const personaJuridicaModificada = req.body
        
        const resultado = await putPersonaJuridica(cuit, personaJuridicaModificada)
        
        if (!resultado) {
            return res.status(404).json({ message: "No se encontró la empresa" })
        }
        return res.status(200).json({
            message: 'Empresa modificada correctamente',
            personaJuridica: resultado
        })
    } catch (error: any) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                message: "Error de validación en los datos ingresados",
                detalles: error.issues 
            })
        }
        return res.status(500).json({ error: error.message })
    }
}

async function borrarPersonaJuridica(req: Request, res: Response) {
    try {
        const cuit = req.params.cuit as string;
        
        const response = await deletePersonaJuridica(cuit)
        if (!response) {
            return res.status(404).json({ message: "No se encontró la empresa" })
        }
        return res.status(200).json({
            message: 'Empresa eliminada correctamente',
        })
    } catch (error: any) {
        return res.status(500).json({ error: error.message })
    }
}

export {
    obtenerPersonasJuridicas,
    obtenerPersonaJuridica,
    crearPersonaJuridica,
    borrarPersonaJuridica,
    modificarPersonaJuridica
};