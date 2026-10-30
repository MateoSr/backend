import { getAllPersonasFisicas, getPersonaFisicaDni, postPersonaFisica, deletePersonaFisica, putPersonaFisica} from "./personaFisica.service.js"
import { ZodError } from 'zod';
import { type Request, type Response } from "express";

async function obtenerPersonasFisicas(req: Request, res: Response) {
    try {
        const personasFisicas = await getAllPersonasFisicas()

        if (personasFisicas.length === 0) {
            return res.status(404).json({ message: "No hay personas físicas registradas" })
        }

        return res.status(200).json(personasFisicas)
    } catch (error: any) {
        return res.status(500).json({ error: error.message }) 
    }
}

async function obtenerPersonaFisica(req: Request, res: Response) {
    try {
        const  dni  = req.params.dni as string
        
        const personaFisica = await getPersonaFisicaDni(dni)
        if (!personaFisica) {
            return res.status(404).json({ message: "No se encontró la persona" })
        }
        
        return res.status(200).json(personaFisica)
    } catch (error: any) {
        return res.status(500).json({ error: error.message })
    }
}

async function crearPersonaFisica(req: Request, res: Response) {
    try {
        const personaFisica = req.body
        const resultado = await postPersonaFisica(personaFisica)
        
        return res.status(201).json({
            message: 'Persona creada correctamente',
            personaFisica: resultado
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

async function modificarPersonaFisica(req: Request, res: Response) {
    try {
        const  dni  = req.params.dni as string
        const personaFisicaModificada = req.body
        const resultado = await putPersonaFisica(dni, personaFisicaModificada)
        
        if (!resultado) {
            return res.status(404).json({ message: "No se encontró la persona" })
        }
        
        return res.status(200).json({
            message: 'Persona modificada correctamente',
            personaFisica: resultado // Devolvemos el registro guardado en la base de datos
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

async function borrarPersonaFisica(req: Request, res: Response) {
    try {
        const  dni  = req.params.dni as string
        const response = await deletePersonaFisica(dni)
        
        if (!response) {
            return res.status(404).json({ message: "No se encontró la persona" })
        }
        
        return res.status(200).json({
            message: 'Persona eliminada correctamente',
        })
    } catch (error: any) {
        return res.status(500).json({ error: error.message })
    }
}

export {
    obtenerPersonasFisicas,
    obtenerPersonaFisica,
    crearPersonaFisica,
    borrarPersonaFisica,
    modificarPersonaFisica
};