import { prisma } from "../shared/prisma.js";

const ESTADOS_FINALES = ["Cancelado", "Cancelada", "Finalizado", "Finalizada"];

// Variantes en mayúsculas para el filtro de la query (datos legacy).
const ESTADOS_FINALES_UPPER = ESTADOS_FINALES.map((e) => e.toUpperCase());

// Set en minúsculas para comparar de forma insensible a mayúsculas en JS.
const ESTADOS_FINALES_SET = new Set(ESTADOS_FINALES.map((e) => e.toLowerCase()));

export async function liberarTurnosPendientesExpirados(): Promise<void> {
  const hace10Min = new Date(Date.now() - 10 * 60 * 1000);

  const vencidos = await prisma.ordenPago.findMany({
    where: {
      estado: "pendiente",
      createdAt: { lt: hace10Min },
      turnoId: { not: null },
    },
    include: { turno: true },
  });

  for (const orden of vencidos) {
    try {
      if (orden.turnoId) {
        await prisma.turno.delete({ where: { id: orden.turnoId } }).catch(() => {});
      }
      await prisma.ordenPago.update({
        where: { id: orden.id },
        data: { estado: "expirada", motivoRechazo: "Expirado por falta de pago (10 minutos)" },
      });
    } catch (e) {
      console.error("Error liberando turno pendiente vencido:", e);
    }
  }
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
      fechaInicio: true,
      fechaFin: true,
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

    const inicio = new Date(turno.fechaInicio);
    const fin = new Date(turno.fechaFin);

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
