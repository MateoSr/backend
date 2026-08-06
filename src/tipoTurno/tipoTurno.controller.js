import {getTipoTurnoId,getAllTipoTurnos} from './tipoTurno.service.js'

async function obtenerTipoTurnos(req,res) {
    try{
        const tipoTurnos = await getAllTurnos()
        if(tipoTurnos == 0){
            return res.status(404).json({message:"No hay tipos de turno"})
        }
        return res.status(200).json(complejos)
        }catch(error)
        {
        return res.status(400).json({error:error.message})
        }
}

async function obtenerTipoTurno(req,res) {
    try{
        const {id} = req.params
        const tipoTurno = await getTipoTurnoId(id)
        if(!tipoTurno){
            return res.status(404).json({message:"No se encontro el tipo de turno"})
        }
        return res.status(200).json(complejo)
        }catch(error)
        {
        return res.status(400).json({error:error.message})
        }
}
