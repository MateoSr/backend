import {type Request, type Response} from 'express'
import { menuDuenoDatos } from './menu.service.js';

async function obtenerDatosMenuDueno(req:Request,res:Response) {
    try{
        const duenoId = req.usuario?.userId;
    if (!duenoId) {
            return res.status(401).json({ message: "Usuario no autenticado" });
        }
        if (req.usuario?.rol !== "Dueño") {
            return res.status(403).json({ message: "Solo un Dueño puede consultar este panel" });
    }
    const datos = await menuDuenoDatos(duenoId)
    if (!datos) {
            return res.status(404).json({ message: "No se pudieron cargar los datos de los complejos" });
    }
    return res.status(200).json(datos);
    }catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
}

export { obtenerDatosMenuDueno}