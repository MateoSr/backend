import {getPrecio,getAllPrecios,postPrecio} from './precio.service.js'
import { ZodError } from 'zod'; //modulo que permimte mostrar los errores de tipos de datos
async function obtenerPrecios(req,res) {
    try{
        const precios = await getAllPrecios()
        if(precios == 0){
            return res.status(404).json({message:"No hay precio"})
        }
        return res.status(200).json(precios)
        }catch(error)
        {
        return res.status(400).json({error:error.message})
        }
}

async function obtenerPrecio(req,res) {
    try{
        const {id_complejo,nro_cancha,fechaDesde} = req.params
        const precio = await getPrecio(id_complejo,nro_cancha,fechaDesde)
        if(!precio){
            return res.status(404).json({message:"No se encontro el precio"})
        }
        return res.status(200).json(precio)
        }catch(error)
        {
        return res.status(400).json({error:error.message})
        }
}

async function crearPrecio(req,res) {
    try{
        const precio = req.body
        const resultado = await postPrecio(precio)
        return res.status(201).json({
            message: 'Precio creado correctamente',
            precio: resultado
        })

        }catch(error)
        {
        if (error instanceof ZodError) {
        return res.status(400).json({
            message: "Error de validación en los datos ingresados",})
        }
        return res.status(400).json({error:error.message})
        }
}

export {
  obtenerPrecio,
  obtenerPrecios,
  crearPrecio
};