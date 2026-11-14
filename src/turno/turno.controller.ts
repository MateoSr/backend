import {getTurnoId,getAllTurnos,postTurno,postTurnoComoEncargado,putTurno,deleteTurno,getTurnoPorComplejo,cancelarTurnoServicio} from './turno.service.js'
import {type Request,type Response} from 'express'
import { turnoSchema } from './turno.schema.js'
import { errores, asegurarEncontrado } from '../shared/errors.js'

async function obtenerTurnos(req:Request,res:Response) {
    const userId = req.usuario?.userId;
    const turnos = await getAllTurnos({clienteId: userId })
    return res.status(200).json(turnos)
}

async function obtenerTurno(req:Request,res:Response) {
    const {id} = req.params
    const turno = asegurarEncontrado(await getTurnoId(Number(id)), "el turno")
    return res.status(200).json(turno)
}

async function obtenerTurnoPorComplejo(req:Request,res:Response) {
    const {id} = req.params
    const turnos = await getTurnoPorComplejo(Number(id))
    return res.status(200).json(turnos)
}

async function crearTurno(req:Request,res:Response) {
    const turno = turnoSchema.parse(req.body)
    const resultado = await postTurno(turno)
    return res.status(201).json({
        message: 'Turno creado correctamente',
        turno: resultado
    })
}

async function crearTurnoComoEncargado(req:Request,res:Response) {
    if (req.usuario?.rol !== "Encargado") {
        throw errores.prohibido("Solo un encargado puede agendar de esta forma")
    }

    const { cliente, turno } = req.body;
    const turnoValidado = turnoSchema.parse(turno);
    const resultado = await postTurnoComoEncargado(turnoValidado, cliente);
    return res.status(201).json({ message: 'Turno agendado correctamente', turno: resultado });
}

async function modificarTurno(req:Request,res:Response) {
    const {id} = req.params
    const turnoModificado = turnoSchema.partial().parse(req.body)
    const resultado = await putTurno(Number(id),turnoModificado)
    if(!resultado){
        throw errores.noEncontrado("el turno")
    }
    return res.status(200).json({
        message: 'Turno modificado correctamente',
        turno: turnoModificado
    })
}

async function borrarTurno(req:Request,res:Response) {
    const {id} = req.params
    const response = await deleteTurno(Number(id))
    if(!response){
        throw errores.noEncontrado("el turno")
    }
    return res.status(200).json({
        message: 'Turno eliminado correctamente',
    })
}

async function cancelarTurno(req: Request, res: Response) {
    const {id} = req.params;
    const turnoId = Number(id);

    if (isNaN(turnoId)) {
        throw errores.solicitudInvalida('El ID del turno es inválido.')
    }

    const turnoActualizado = await cancelarTurnoServicio(turnoId);

    return res.status(200).json({
        message: 'Turno cancelado con éxito',
        turno: turnoActualizado,
    });
}

export {
  obtenerTurno,
  obtenerTurnos,
  crearTurno,
  crearTurnoComoEncargado,
  modificarTurno,
  borrarTurno,
  obtenerTurnoPorComplejo,
  cancelarTurno,

};
