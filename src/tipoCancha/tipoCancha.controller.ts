import { getTipoCanchaId, getAllTipoCanchas } from './tipoCancha.service.js'
import { type Request, type Response } from 'express'

async function obtenerTipoCanchas(req: Request, res: Response) {
    try {
        const tipoCanchas = await getAllTipoCanchas()
        
        if (tipoCanchas.length === 0) {
            return res.status(404).json({ message: "No hay tipos de cancha" })
        }
        
        return res.status(200).json(tipoCanchas)
    } catch (error: any) {
        return res.status(500).json({ error: error.message })
    }
}

async function obtenerTipoCancha(req: Request, res: Response) {
    try {
        const id = Number(req.params.id)
        
        // Validación extra: evitamos mandarle "NaN" a Prisma
        if (isNaN(id)) {
            return res.status(400).json({ message: "El ID debe ser un número válido" })
        }

        const tipoCancha = await getTipoCanchaId(id)
        
        if (!tipoCancha) {
            return res.status(404).json({ message: "No se encontró el tipo de cancha" })
        }
        
        return res.status(200).json(tipoCancha)
    } catch (error: any) {
        return res.status(500).json({ error: error.message }) // Cambié a 500 por la misma razón
    }
}

export {
    obtenerTipoCancha,
    obtenerTipoCanchas
};