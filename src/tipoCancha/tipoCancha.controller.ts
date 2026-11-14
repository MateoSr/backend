import { getTipoCanchaId, getAllTipoCanchas } from './tipoCancha.service.js'
import { type Request, type Response } from 'express'
import { errores, asegurarEncontrado } from '../shared/errors.js'

async function obtenerTipoCanchas(req: Request, res: Response) {
    const tipoCanchas = await getAllTipoCanchas()
    return res.status(200).json(tipoCanchas)
}

async function obtenerTipoCancha(req: Request, res: Response) {
    const id = Number(req.params.id)

    // Validación extra: evitamos mandarle "NaN" a Prisma
    if (isNaN(id)) {
        throw errores.solicitudInvalida("El ID debe ser un número válido")
    }

    const tipoCancha = asegurarEncontrado(await getTipoCanchaId(id), "el tipo de cancha")
    return res.status(200).json(tipoCancha)
}

export {
    obtenerTipoCancha,
    obtenerTipoCanchas
};
