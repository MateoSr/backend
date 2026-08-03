import { getTiposUsuario, getTipoUsuario } from "./tipoUsuario.service.js"

async function obtenerTiposUsuario(req,res){
    try {
        const tiposUsuario = await getTiposUsuario()
        if(!tiposUsuario){
            return res.status(404).json({message: "No se encontraron tipos de usuario"})
        }
        return res.status(200).json(tiposUsuario)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

async function obtenerTipoUsuario(req,res){
    try {
        const {id} = req.params
        console.log(id)
        const tipoUsuario = await getTipoUsuario(id)
        console.log(tipoUsuario)
        if(!tipoUsuario){
            return res.status(404).json({message: "No se encontro el tipo de usuario"})
        }
        return res.status(200).json(tipoUsuario)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export {
    obtenerTiposUsuario,
    obtenerTipoUsuario
}