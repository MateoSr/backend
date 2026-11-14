import {getComplejoId,getComplejoDelEncargado,getAllComplejos,postComplejo,putComplejo,deleteComplejo,bajaComplejo,buscarComplejosDisponibles, getComplejoDelDueno, getDisponibilidadComplejo} from './complejos.service.js'
import {type Request, type Response} from 'express'
import { complejoSchema } from './complejos.schema.js'
import cloudinary from '../config/cloudinary.js'
import { errores, asegurarEncontrado } from '../shared/errors.js'


async function obtenerComplejos(req: Request, res: Response) {
    const complejos = await getAllComplejos()
    return res.status(200).json(complejos)
}

async function obtenerComplejo(req: Request, res: Response) {
    const {id} = req.params
    const complejo = asegurarEncontrado(await getComplejoId(Number(id)), "el complejo")
    return res.status(200).json(complejo)
}

async function obtenerDisponibilidad(req: Request, res: Response) {
    const complejoId = Number(req.params.id);
    if (!Number.isInteger(complejoId)) {
        throw errores.solicitudInvalida("El id del complejo es inválido.")
    }

    const fechaParam = typeof req.query.fecha === "string" ? req.query.fecha : undefined;
    const fecha = fechaParam || new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString().slice(0, 10);

    const disponibilidad = await getDisponibilidadComplejo(complejoId, fecha);
    return res.status(200).json(disponibilidad);
}

async function obtenerComplejoDelEncargado(req: Request, res: Response) {
    const encargadoId = req.usuario?.userId;
    if (!encargadoId) {
        throw errores.noAutorizado("Usuario no autenticado")
    }
    if (req.usuario?.rol !== "Encargado") {
        throw errores.prohibido("Solo un encargado puede consultar este panel")
    }

    const complejo = asegurarEncontrado(
        await getComplejoDelEncargado(encargadoId),
        "el complejo asignado al encargado"
    );

    return res.status(200).json(complejo);
}

async function obtenerComplejoDelDueno(req: Request, res: Response) {
    const duenoId = req.usuario?.userId;
    if (!duenoId) {
        throw errores.noAutorizado("Usuario no autenticado")
    }
    if (req.usuario?.rol !== "Dueño") {
        throw errores.prohibido("Solo un Dueño puede consultar este panel")
    }

    const complejo = asegurarEncontrado(
        await getComplejoDelDueno(duenoId),
        "el complejo asignado al dueño"
    );
    return res.status(200).json(complejo);
}

async function crearComplejo(req: Request, res: Response) {
    const complejo = complejoSchema.parse(req.body)

    if (complejo.imagenBase64) {
        const base64Data = complejo.imagenBase64 as string;
        const dataUriRegex = /^data:(image\/(jpeg|jpg|png|webp));base64,(.+)$/i;
        const match = base64Data.match(dataUriRegex);

        if (!match) {
            throw errores.solicitudInvalida('Formato de imagen inválido. Solo se permiten JPG, PNG o WEBP.')
        }

        const base64String = match[3];
        const padding = base64String.endsWith('==') ? 2 : base64String.endsWith('=') ? 1 : 0;
        const sizeInBytes = Math.floor((base64String.length * 3) / 4) - padding;
        const maxSizeInBytes = 2 * 1024 * 1024;

        if (sizeInBytes > maxSizeInBytes) {
            throw errores.solicitudInvalida('La imagen supera los 2MB.')
        }

        try {
            const uploadResult = await cloudinary.uploader.upload(base64Data, {
                folder: 'complejos'
            })
            complejo.imagenUrl = uploadResult.secure_url
        } catch (uploadError) {
            console.error('Error al subir la imagen a Cloudinary', uploadError)
            throw errores.errorExterno('Error al subir la imagen a Cloudinary')
        }
        delete complejo.imagenBase64
    }

    const resultado = await postComplejo(complejo)
    return res.status(201).json({
        message: 'Complejo creado correctamente',
        complejo: resultado
    })
}

async function modificarComplejo(req: Request, res: Response) {
    const {id} = req.params
    const complejoModificado = complejoSchema.partial().parse(req.body)
    const resultado = await putComplejo(Number(id),complejoModificado)
    if(!resultado){
        throw errores.noEncontrado("el complejo")
    }
    return res.status(200).json({
        message: 'Complejo modificado correctamente',
        complejo: complejoModificado
    })
}

async function darDeBajaComplejo(req: Request, res: Response) {
    const {id} = req.params
    const complejo = await bajaComplejo(Number(id))
    if(!complejo){
        throw errores.noEncontrado("el complejo")
    }
    return res.status(200).json({
        message: 'Complejo dado de baja correctamente',
        complejo
    })
}

async function borrarComplejo(req: Request, res: Response) {
    const {id} = req.params
    const response = await deleteComplejo(Number(id))
    if(!response){
        throw errores.noEncontrado("el complejo")
    }
    return res.status(200).json({
        message: 'Complejo eliminado correctamente',
    })
}

async function obtenerComplejosDisponibles(req: Request, res: Response) {
    const ciudad = req.query.ciudad as string;
    const deporte = req.query.deporte as string;
    const fecha = req.query.fecha as string;
    const hora = req.query.hora as string;
    const sort = typeof req.query.sort === "string" ? req.query.sort : "relevantes";
    const min = req.query.min !== undefined ? Number(req.query.min) : undefined;
    const max = req.query.max !== undefined ? Number(req.query.max) : undefined;
    const page = req.query.page !== undefined ? Number(req.query.page) : 1;
    const limit = req.query.limit !== undefined ? Number(req.query.limit) : 12;

    if ((min !== undefined && !Number.isFinite(min))
            || (max !== undefined && !Number.isFinite(max))) {
        throw errores.solicitudInvalida("Los filtros de precio deben ser numéricos.")
    }

    if (!Number.isInteger(page) || page < 1) {
        throw errores.solicitudInvalida("El parámetro page debe ser un entero mayor o igual a 1.")
    }

    if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
        throw errores.solicitudInvalida("El parámetro limit debe ser un entero entre 1 y 50.")
    }

    const { total, data } = await buscarComplejosDisponibles({ ciudad, deporte, fecha, hora, min, max, sort, page, limit });
    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
        total,
        page,
        limit,
        totalPages,
        data,
    });
}

export {
    obtenerComplejo,
    obtenerDisponibilidad,
    obtenerComplejoDelEncargado,
    obtenerComplejoDelDueno,
    obtenerComplejos,
    crearComplejo,
    modificarComplejo,
    borrarComplejo,
    darDeBajaComplejo,
    obtenerComplejosDisponibles
};
