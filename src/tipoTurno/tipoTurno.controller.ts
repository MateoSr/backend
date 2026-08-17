import {getTipoTurnoId,getAllTipoTurnos} from './tipoTurno.service.js'
import {type Request,type Response} from 'express'

async function obtenerTipoTurnos(req: Request, res: Response) {
    try{
        const tipoTurnos = await getAllTipoTurnos()
        if(tipoTurnos.length === 0){
            return res.status(404).json({message:"No hay tipos de turno"})
        }
        return res.status(200).json(tipoTurnos)
        }catch(error:any)
        {
        return res.status(400).json({error:error.message})
        }
}

async function obtenerTipoTurno(req: Request, res: Response) {
    try{
        const {id} = req.params
        const tipoTurno = await getTipoTurnoId(Number(id))
        if(!tipoTurno){
            return res.status(404).json({message:"No se encontro el tipo de turno"})
        }
        return res.status(200).json(tipoTurno)
        }catch(error:any)
        {
        return res.status(400).json({error:error.message})
        }
}

export {
  obtenerTipoTurno,
  obtenerTipoTurnos
};
