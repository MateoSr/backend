import {getEstadisticasHoyDueno} from "../turno/turno.service.js"
import {getCapacidadTotalDuenoPorDia} from "../complejo/complejos.service.js"
import { getCantidadCanchasTotalesDueno } from '../cancha/cancha.service.js'
 
async function menuDuenoDatos(duenoId: number) {
    const hoy = new Date();
    const [capacidadTotal, turnosHoy, cantidadCanchas] = await Promise.all([
    getCapacidadTotalDuenoPorDia(duenoId, hoy),
    getEstadisticasHoyDueno(duenoId),
    getCantidadCanchasTotalesDueno(duenoId)
  ]);
  const { cantidadTurnos, ingresosEstimados, deporteEstrella } = turnosHoy;
  const ocupacionPorcentaje = capacidadTotal > 0 
    ? Math.min(100, Math.round((cantidadTurnos / capacidadTotal) * 100))
    : 0;


  // Retornás el objeto listo para la vista
  return {
    cantidadTurnos,
    ingresosEstimados,
    capacidadTotal,
    ocupacionPorcentaje,
    deporteEstrella,
    cantidadCanchas
  };

}

export {
    menuDuenoDatos
}