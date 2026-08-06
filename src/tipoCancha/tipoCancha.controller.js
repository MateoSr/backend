import {getTipoCanchaId,getAllTipoCanchas} from './tipoCancha.service.js'

async function obtenerTipoCanchas(req,res) {
    try{
        const tipoCanchas = await getAllComplejos()
        if(tipoCanchas == 0){
            return res.status(404).json({message:"No hay tipos de cancha"})
        }
        return res.status(200).json(complejos)
        }catch(error)
        {
        return res.status(400).json({error:error.message})
        }
}

async function obtenerTipoCancha(req,res) {
    try{
        const {id} = req.params
        const tipoCancha = await getTipoCanchaId(id)
        if(!tipoCancha){
            return res.status(404).json({message:"No se encontro el tipo de cancha"})
        }
        return res.status(200).json(complejo)
        }catch(error)
        {
        return res.status(400).json({error:error.message})
        }
}

export {
  obtenerTipoCancha,
  obtenerTipoCanchas
};