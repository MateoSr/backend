import {type Request, type Response} from 'express'
import { menuDuenoDatos } from './menu.service.js';
import { errores, asegurarEncontrado } from '../shared/errors.js';

async function obtenerDatosMenuDueno(req:Request,res:Response) {
    const duenoId = req.usuario?.userId;
    if (!duenoId) {
        throw errores.noAutorizado("Usuario no autenticado")
    }
    if (req.usuario?.rol !== "Dueño") {
        throw errores.prohibido("Solo un Dueño puede consultar este panel")
    }
    const datos = asegurarEncontrado(await menuDuenoDatos(duenoId), "los datos de los complejos")
    return res.status(200).json(datos);
}

export { obtenerDatosMenuDueno}
