import {type Request,type Response} from 'express'
import {getTipoTurnoId,getAllTipoTurnos} from './tipoTurno.service.js'
import { asegurarEncontrado } from '../shared/errors.js'

async function obtenerTipoTurnos(req: Request, res: Response) {
    const tipoTurnos = await getAllTipoTurnos()
    return res.status(200).json(tipoTurnos)
}

async function obtenerTipoTurno(req: Request, res: Response) {
    const {id} = req.params
    const tipoTurno = asegurarEncontrado(
        await getTipoTurnoId(Number(id)),
        "el tipo de turno"
    )
    return res.status(200).json(tipoTurno)
}

export {
  obtenerTipoTurno,
  obtenerTipoTurnos
};
