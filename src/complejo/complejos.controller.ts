import {getComplejoId,getComplejoDelEncargado,getAllComplejos,postComplejo,putComplejo,deleteComplejo,buscarComplejosDisponibles, getComplejoDelDueno} from './complejos.service.js'
import { ZodError } from 'zod';
import e, {type Request, type Response} from 'express'
import cloudinary from '../config/cloudinary.js'
import console from 'console';


async function obtenerComplejos(req: Request, res: Response) {
    try{
        const complejos = await getAllComplejos()
        if(complejos.length === 0){
            return res.status(404).json({message:"No hay complejos"})
        }
        return res.status(200).json(complejos)
        }catch(error:any)
        {
        return res.status(400).json({error:error.message})
        }
}

async function obtenerComplejo(req: Request, res: Response) {
    try{
        const {id} = req.params
        const complejo = await getComplejoId(Number(id))
        if(!complejo){
            return res.status(404).json({message:"No se encontró el complejo"})
        }
        return res.status(200).json(complejo)
        }catch(error:any)
        {
        return res.status(400).json({error:error.message})
        }
}

async function obtenerComplejoDelEncargado(req: Request, res: Response) {
    try {
        const encargadoId = req.usuario?.userId;
        if (!encargadoId) {
            return res.status(401).json({ message: "Usuario no autenticado" });
        }
        if (req.usuario?.rol !== "Encargado") {
            return res.status(403).json({ message: "Solo un encargado puede consultar este panel" });
        }

        const complejo = await getComplejoDelEncargado(encargadoId);
        if (!complejo) {
            return res.status(404).json({ message: "El encargado no tiene un complejo asignado" });
        }

        return res.status(200).json(complejo);
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
}

async function obtenerComplejoDelDueno(req: Request, res: Response) {
    try {
        const duenoId = req.usuario?.userId;
        if (!duenoId) {
            return res.status(401).json({ message: "Usuario no autenticado" });
        }
        if (req.usuario?.rol !== "Dueño") {
            return res.status(403).json({ message: "Solo un Dueño puede consultar este panel" });
        }

        const complejo = await getComplejoDelDueno(duenoId);
        if (!complejo) {
            return res.status(404).json({ message: "El Dueño no tiene un complejo asignado" });
        }
        return res.status(200).json(complejo);
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
}

async function crearComplejo(req: Request, res: Response) {
    try{
        const complejo = { ...req.body }

        if (complejo.imagenBase64) {
            const base64Data = complejo.imagenBase64 as string;
            const dataUriRegex = /^data:(image\/(jpeg|jpg|png|webp));base64,(.+)$/i;
            const match = base64Data.match(dataUriRegex);

            if (!match) {
                return res.status(400).json({ error: 'Formato de imagen inválido. Solo se permiten JPG, PNG o WEBP.' });
            }

            const base64String = match[3];
            const padding = base64String.endsWith('==') ? 2 : base64String.endsWith('=') ? 1 : 0;
            const sizeInBytes = Math.floor((base64String.length * 3) / 4) - padding;
            const maxSizeInBytes = 2 * 1024 * 1024;

            if (sizeInBytes > maxSizeInBytes) {
                return res.status(400).json({ error: 'La imagen supera los 2MB.' });
            }

            try {
                const uploadResult = await cloudinary.uploader.upload(base64Data, {
                    folder: 'complejos'
                })
                complejo.imagenUrl = uploadResult.secure_url
            } catch (uploadError: any) {
                console.log(uploadError)
                return res.status(400).json({ error: 'Error al subir la imagen a Cloudinary' })
            }
            delete complejo.imagenBase64
        }

        const resultado = await postComplejo(complejo)
        return res.status(201).json({
            message: 'Complejo creado correctamente',
            complejo: resultado
        })

        }catch(error:any)
        {
        if (error instanceof ZodError) {
            console.log("zod")
            console.log(error.message)
        return res.status(400).json({
            message: "Error de validación en los datos ingresados",})
        }
        console.log(error.message)
        return res.status(400).json({error:error.message})
        }
}

async function modificarComplejo(req: Request, res: Response) {
    try{
        const {id} = req.params
        const complejoModificado = req.body
        const resultado = await putComplejo(Number(id),complejoModificado)
        if(!resultado){
            return res.status(404).json({message:"No se encontró el complejo"})
        }
        return res.status(200).json({
            message: 'Complejo modificado correctamente',
            complejo: complejoModificado
        })
        }catch(error:any)
        {
        return res.status(400).json({error:error.message})
        }
}

async function borrarComplejo(req: Request, res: Response) {
    try{
        const {id} = req.params
        const response = await deleteComplejo(Number(id))
        if(!response){
            return res.status(404).json({message:"No se encontró el complejo"})
        }
        return res.status(200).json({
            message: 'Complejo eliminado correctamente',
        })
        }catch(error:any)
        {
        return res.status(400).json({error:error.message})
        }
}

async function obtenerComplejosDisponibles(req: Request, res: Response) {
    const ciudad = req.query.ciudad as string;
    const deporte = req.query.deporte as string;
    const fecha = req.query.fecha as string;
    const hora = req.query.hora as string;
    const min = req.query.min !== undefined ? Number(req.query.min) : undefined;
    const max = req.query.max !== undefined ? Number(req.query.max) : undefined;

        if ((min !== undefined && !Number.isFinite(min))
                || (max !== undefined && !Number.isFinite(max))) {
                return res.status(400).json({ message: "Los filtros de precio deben ser numéricos." });
        }

        const resultados = await buscarComplejosDisponibles({ ciudad, deporte, fecha, hora, min, max });
    if(resultados.length === 0) {
      return res.status(404).json({ message: "No se encontraron complejos disponibles con los filtros proporcionados." });
    }

    return res.json({
      total: resultados.length,
      data: resultados,
    });
}

export {
    obtenerComplejo,
    obtenerComplejoDelEncargado,
    obtenerComplejoDelDueno,
    obtenerComplejos,
    crearComplejo,
    modificarComplejo,
    borrarComplejo,
    obtenerComplejosDisponibles
};