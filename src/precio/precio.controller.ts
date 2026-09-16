import {getPrecio,getAllPrecios,postPrecio} from './precio.service.js'
import { ZodError } from 'zod'; //modulo que permimte mostrar los errores de tipos de datos
import {type Request, type Response} from 'express'
async function obtenerPrecios(req: Request, res: Response) {
    const {id_complejo,nro_cancha} = req.params
    try{
        const precios = await getAllPrecios(Number(id_complejo),Number(nro_cancha))
        if(!precios){
            return res.status(404).json({message:"No hay precios registrados para este complejo y cancha"})
        }
        return res.status(200).json(precios)
        }catch(error:any)
        {
        return res.status(400).json({error:error.message})
        }
}

async function obtenerPrecio(req: Request, res: Response) {
    try{
        const {id_complejo,nro_cancha,fechaDesde} = req.params
        const precio = await getPrecio(Number(id_complejo),Number(nro_cancha),String(fechaDesde))
        if(!precio){
            return res.status(404).json({message:"No se encontro el precio"})
        }
        return res.status(200).json(precio)
        }catch(error:any)
        {
        return res.status(400).json({error:error.message})
        }
}

async function crearPrecio(req: Request, res: Response) {
    try{
        const {id_complejo,nro_cancha} =req.params
        const precio = req.body
        const precioPost = {id_complejo:Number(id_complejo),nro_cancha:Number(nro_cancha), ...precio}
        const resultado = await postPrecio(precioPost)
        return res.status(201).json({
            message: 'Precio creado correctamente',
            precio: resultado
        })

        }catch(error:any)
        {
        if (error instanceof ZodError) {
            console.log(error)
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