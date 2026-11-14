import {getPrecio,getAllPrecios,postPrecio} from './precio.service.js'
import {type Request, type Response} from 'express'
import { precioSchema } from './precio.schema.js'
import { asegurarEncontrado } from '../shared/errors.js'

async function obtenerPrecios(req: Request, res: Response) {
    const {id_complejo,nro_cancha} = req.params
    const precios = await getAllPrecios(Number(id_complejo),Number(nro_cancha))
    return res.status(200).json(precios)
}

async function obtenerPrecio(req: Request, res: Response) {
    const {id_complejo,nro_cancha,fechaDesde} = req.params
    const precio = asegurarEncontrado(
        await getPrecio(Number(id_complejo),Number(nro_cancha),String(fechaDesde)),
        "el precio"
    )
    return res.status(200).json(precio)
}

async function crearPrecio(req: Request, res: Response) {
    const {id_complejo,nro_cancha} =req.params
    const precio = req.body
    const precioPost = precioSchema.parse({id_complejo:Number(id_complejo),nro_cancha:Number(nro_cancha), ...precio})
    const resultado = await postPrecio(precioPost)
    return res.status(201).json({
        message: 'Precio creado correctamente',
        precio: resultado
    })
}

export {
  obtenerPrecio,
  obtenerPrecios,
  crearPrecio
};
