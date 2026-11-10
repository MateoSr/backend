import { prisma } from "../shared/prisma.js";

const ESTADOS_FINALES = ["Cancelado", "Cancelada", "Finalizado", "Finalizada"];

// Variantes en mayúsculas para el filtro de la query (datos legacy).
const ESTADOS_FINALES_UPPER = ESTADOS_FINALES.map((e) => e.toUpperCase());

// Set en minúsculas para comparar de forma insensible a mayúsculas en JS.
const ESTADOS_FINALES_SET = new Set(ESTADOS_FINALES.map((e) => e.toLowerCase()));

export async function liberarTurnosPendientesExpirados(): Promise<void> {
  const hace10Min = new Date(Date.now() - 10 * 60 * 1000);

  // 1. Buscamos las órdenes vencidas que tienen un turno asociado
  const vencidos = await prisma.ordenPago.findMany({
    where: {
      estado: "pendiente",
      createdAt: { lt: hace10Min },
      turnoId: { not: null },
    },
    select: { id: true, turnoId: true },
  });

  if (vencidos.length === 0) return;

  //Filtro los id de las ordenes que tiene que actualizar
  const ordenIds = vencidos.map((o) => o.id);
  // Filtra los id de los turnos que tiene que borrar
  const turnoIds = vencidos.map((o) => o.turnoId).filter((id): id is number => id !== null);

  try {
    //Ejecuta todo los cambios en una transaccion y no con un for
    await prisma.$transaction(async (tx) => {
      if (turnoIds.length > 0) {
        await tx.turno.deleteMany({
          where: { id: { in: turnoIds } },
        });
      }

      await tx.ordenPago.updateMany({
        where: { id: { in: ordenIds } },
        data: {
          estado: "expirada",
          motivoRechazo: "Expirado por falta de pago (10 minutos)",
        },
      });
    });
  } catch (e) {
    console.error("Error liberando turnos pendientes vencidos en lote:", e);
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

  //Actualizar directamente a "Finalizado" los turnos cuya fechaFin ya pasó 
  await prisma.turno.updateMany({
    where: {
      estado: { notIn: ESTADOS_FINALES_UPPER },
      fechaFin: { lte: ahora }, 
    },
    data: {
      estado: "Finalizado",
    },
  });

  // Actualizar a "En curso" los turnos que ya empezaron 
  await prisma.turno.updateMany({
    where: {
      estado: { notIn: ESTADOS_FINALES_UPPER },
      fechaInicio: { lte: ahora }, // Ya empezó 
      fechaFin: { gt: ahora },    // Todavía no terminó 
    },
    data: {
      estado: "En curso",
    },
  });
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
