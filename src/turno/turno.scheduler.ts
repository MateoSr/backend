import { prisma } from "../shared/prisma.js";

// Zona horaria de Argentina (offset fijo UTC-3, sin horario de verano)
const OFFSET_ARGENTINA = "-03:00";

const ESTADOS_FINALES = ["Cancelado", "Cancelada", "Finalizado", "Finalizada"];

// Variantes en mayúsculas para el filtro de la query (datos legacy).
const ESTADOS_FINALES_UPPER = ESTADOS_FINALES.map((e) => e.toUpperCase());

// Set en minúsculas para comparar de forma insensible a mayúsculas en JS.
const ESTADOS_FINALES_SET = new Set(ESTADOS_FINALES.map((e) => e.toLowerCase()));

/**
 * Combina la fecha del turno (guardada como @db.Date, medianoche UTC) con la
 * hora "HH:mm" para obtener el instante exacto en horario de Argentina.
 */
function momentoTurno(fecha: Date, hora: string): Date {
  const fechaSolo = fecha.toISOString().slice(0, 10);
  return new Date(`${fechaSolo}T${hora}:00${OFFSET_ARGENTINA}`);
}

/**
 * Actualiza automáticamente el estado de los turnos según la hora actual:
 * - Si ya terminó (ahora >= fin) pasa a "Finalizado".
 * - Si ya empezó pero no terminó (ahora >= inicio) pasa a "En curso".
 * Solo transiciona hacia adelante y nunca toca turnos cancelados.
 */
export async function actualizarEstadosTurnos(): Promise<void> {
  const ahora = new Date();

  const turnos = await prisma.turno.findMany({
    where: {
      estado: { notIn: ESTADOS_FINALES_UPPER },
    },
    select: {
      id: true,
      fecha: true,
      horaInicio: true,
      horaFin: true,
      estado: true,
    },
  });

  const aEnCurso: number[] = [];
  const aFinalizar: number[] = [];

  for (const turno of turnos) {
    // Guarda extra: no tocar turnos ya finales o cancelados (sin importar mayúsculas).
    if (ESTADOS_FINALES_SET.has(turno.estado.toLowerCase())) {
      continue;
    }

    const inicio = momentoTurno(turno.fecha, turno.horaInicio);
    let fin = momentoTurno(turno.fecha, turno.horaFin);

    // Si el turno cruza la medianoche (ej: 22:00 a 01:00), el fin es al día siguiente.
    if (fin <= inicio) {
      fin = new Date(fin.getTime() + 24 * 60 * 60 * 1000);
    }

    if (ahora >= fin) {
      aFinalizar.push(turno.id);
    } else if (ahora >= inicio) {
      aEnCurso.push(turno.id);
    }
  }

  if (aEnCurso.length > 0) {
    await prisma.turno.updateMany({
      where: { id: { in: aEnCurso } },
      data: { estado: "En curso" },
    });
  }

  if (aFinalizar.length > 0) {
    await prisma.turno.updateMany({
      where: { id: { in: aFinalizar } },
      data: { estado: "Finalizado" },
    });
  }
}

/**
 * Arranca el job de actualización de estados. Ejecuta una vez al inicio y luego
 * cada `intervaloMs` milisegundos (por defecto 10 minutos).
 */
export function iniciarSchedulerTurnos(intervaloMs = 10 * 60 * 1000): NodeJS.Timeout {
  actualizarEstadosTurnos().catch((error) => {
    console.error("Error al actualizar estados de turnos:", error);
  });

  return setInterval(() => {
    actualizarEstadosTurnos().catch((error) => {
      console.error("Error al actualizar estados de turnos:", error);
    });
  }, intervaloMs);
}
