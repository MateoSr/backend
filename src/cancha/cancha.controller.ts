import {getCanchaNro,getAllCanchas,postCancha,putCancha,deleteCancha} from './cancha.service.js'
import {type Request, type Response} from 'express'
import { canchaSchema } from './cancha.schema.js'
import { errores, asegurarEncontrado } from '../shared/errors.js'

async function obtenerCanchas(req: Request, res: Response) {
    const {id_complejo} = req.params
    const canchas = await getAllCanchas(Number(id_complejo))
    return res.status(200).json(canchas)
}

async function obtenerCancha(req: Request, res: Response) {
    const {nro} = req.params
    const {id_complejo} = req.params
    const cancha = asegurarEncontrado(
        await getCanchaNro(Number(nro), Number(id_complejo)),
        "la cancha"
    )
    return res.status(200).json(cancha)
}

async function crearCancha(req: Request, res: Response) {
    const {id_complejo} = req.params
    const cancha = canchaSchema.parse(req.body)
    const resultado = await postCancha(cancha, Number(id_complejo))
    return res.status(201).json({
        message: 'Cancha creada correctamente',
        cancha: resultado
    })
}

async function modificarCancha(req: Request, res: Response) {
    const {id_complejo} = req.params
    const {nro} = req.params
    const canchaModificada = canchaSchema.partial().parse(req.body)
    const resultado = await putCancha(Number(nro), Number(id_complejo), canchaModificada)
    if(!resultado){
        throw errores.noEncontrado("la cancha")
    }
    return res.status(200).json({
        message: 'Cancha modificada correctamente',
        cancha: canchaModificada
    })
}

async function borrarCancha(req: Request, res: Response) {
    const {id_complejo} = req.params
    const {nro} = req.params
    const response = await deleteCancha(Number(nro), Number(id_complejo))
    if(!response){
        throw errores.noEncontrado("la cancha")
    }
    return res.status(200).json({
        message: 'Cancha eliminada correctamente',
    })
}

export {
  obtenerCancha,
  obtenerCanchas,
  crearCancha,
  modificarCancha,
  borrarCancha
};
