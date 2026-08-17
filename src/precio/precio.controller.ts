import {getPrecio,getAllPrecios,postPrecio} from './precio.service.js'
import { ZodError } from 'zod'; //modulo que permimte mostrar los errores de tipos de datos
import {type Request, type Response} from 'express'
async function obtenerPrecios(req: Request, res: Response) {
    try{
        const precios = await getAllPrecios()
        if(!precios){
            return res.status(404).json({message:"No hay precio"})
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
        const precio = req.body
        const resultado = await postPrecio(precio)
        return res.status(201).json({
            message: 'Precio creado correctamente',
            precio: resultado
        })

        }catch(error:any)
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