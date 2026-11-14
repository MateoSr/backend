import {getHorarios,getHorario,postHorario,putHorario,deleteHorario} from "./horario.service.js"
import {type Request, type Response} from 'express'
import { horarioSchema } from "./horario.schema.js"
import { errores, asegurarEncontrado } from "../shared/errors.js"


async function obtenerHorarios(req: Request, res: Response) {
    const {id_complejo} = req.params
    const horarios = await getHorarios(Number(id_complejo))

    return res.status(200).json(horarios)
}

async function obtenerHorario(req: Request, res: Response) {
    const {id_complejo,num_dia} = req.params
    const horario = asegurarEncontrado(
        await getHorario(Number(id_complejo), Number(num_dia)),
        "el horario para ese día"
    )
    return res.status(200).json(horario)
}

async function crearHorario(req: Request, res: Response) {
    const {id_complejo} = req.params
    const horario = horarioSchema.parse(req.body)
    await postHorario(horario, Number(id_complejo))
    return res.status(201).json({
        message: 'Horario creado correctamente',
        horario: horario
    })
}

async function modificarHorario(req: Request, res: Response) {
    const {id_complejo,num_dia} = req.params
    const horarioNuevo = horarioSchema.partial().parse(req.body)
    const resultado = await putHorario(Number(id_complejo), Number(num_dia), horarioNuevo)
    if(!resultado){
        throw errores.noEncontrado("el horario")
    }
    return res.status(200).json({
        message: 'Horario modificado correctamente',
        horario: horarioNuevo
    })
}

async function borrarHorario(req: Request, res: Response) {
    const {id_complejo,num_dia} = req.params
    const resultado = await deleteHorario(Number(id_complejo), Number(num_dia))
    if(!resultado){
        throw errores.noEncontrado("el horario")
    }
    return res.status(200).json({message:"Horario borrado correctamente"})
}

export {
    obtenerHorario,
    obtenerHorarios,
    crearHorario,
    modificarHorario,
    borrarHorario
}
