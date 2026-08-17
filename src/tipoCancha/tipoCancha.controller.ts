import {getTipoCanchaId,getAllTipoCanchas} from './tipoCancha.service.js'
import {type Request,type Response} from 'express'

async function obtenerTipoCanchas(req: Request, res: Response) {
    try{
        const tipoCanchas = await getAllTipoCanchas()
        if(tipoCanchas.length === 0){
            return res.status(404).json({message:"No hay tipos de cancha"})
        }
        return res.status(200).json(tipoCanchas)
        }catch(error:any)
        {
        return res.status(400).json({error:error.message})
        }
}

async function obtenerTipoCancha(req: Request, res: Response) {
    try{
        const {id} = req.params
        const tipoCancha = await getTipoCanchaId(Number(id))
        if(!tipoCancha){
            return res.status(404).json({message:"No se encontro el tipo de cancha"})
        }
        return res.status(200).json(tipoCancha)
        }catch(error:any)
        {
        return res.status(400).json({error:error.message})
        }
}

export {
  obtenerTipoCancha,
  obtenerTipoCanchas
};