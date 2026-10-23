import { turnoSchema, type Turno } from "./turno.schema.js";
import { prisma } from "../shared/prisma.js";
import { enviarEmailComprobanteReserva } from "../email/email.service.js";

export interface TurnoSalida extends Turno {
    id: number;
    
}

export interface FiltrosTurno {
  clienteId?: number;
}

// const turnos:TurnoSalida[] =  
//   {"id": 1, "id_cliente": 1, "id_tipo_turno": 1, "id_complejo": 10, "nro_cancha": 1,"fecha":"2000-01-01", "horarioInicio": "18:00", "horarioFin": "19:30", "estado": "reservado"},
//   {"id": 2, "id_cliente": 1, "id_tipo_turno": 1, "id_complejo": 10, "nro_cancha": 2,"fecha":"2000-01-01", "horarioInicio": "19:30", "horarioFin": "21:00", "estado": "reservado"},
//   {"id": 3, "id_cliente": 1, "id_tipo_turno": 2, "id_complejo": 12, "nro_cancha": 3,"fecha":"2000-01-01", "horarioInicio": "21:00", "horarioFin": "22:30", "estado": "completado"},
//   {"id": 4, "id_cliente": 2, "id_tipo_turno": 1, "id_complejo": 10, "nro_cancha": 1,"fecha":"2000-01-01" ,"horarioInicio": "19:00", "horarioFin": "20:30", "estado": "reservado"},
//   {"id": 5, "id_cliente": 2, "id_tipo_turno": 1, "id_complejo": 11, "nro_cancha": 1,"fecha":"2000-01-01" ,"horarioInicio": "20:00", "horarioFin": "21:30", "estado": "cancelado", "motivoCancelacion": "Lluvia intensa y filtraciones en cancha"},
//   {"id": 6, "id_cliente": 3, "id_tipo_turno": 2, "id_complejo": 12, "nro_cancha": 2,"fecha":"2000-01-01" ,"horarioInicio": "17:00", "horarioFin": "18:30", "estado": "reservado"},
//   {"id": 7, "id_cliente": 1, "id_tipo_turno": 1, "id_complejo": 11, "nro_cancha": 4,"fecha":"2000-01-01", "horarioInicio": "20:30", "horarioFin": "22:00", "estado": "reservado"},
//   {"id": 8, "id_cliente": 4, "id_tipo_turno": 1, "id_complejo": 10, "nro_cancha": 1,"fecha":"2000-01-01", "horarioInicio": "18:30", "horarioFin": "20:00", "estado": "completado"},
//   {"id": 9, "id_cliente": 2, "id_tipo_turno": 2, "id_complejo": 12, "nro_cancha": 1,"fecha":"2000-01-01", "horarioInicio": "22:00", "horarioFin": "23:30", "estado": "cancelado", "motivoCancelacion": "Aviso del cliente por motivos personales"},
//   {"id": 10, "id_cliente": 3, "id_tipo_turno": 1, "id_complejo": 10, "nro_cancha": 3,"fecha":"2000-01-01", "horarioInicio": "19:00", "horarioFin": "20:30", "estado": "reservado"}

// ]


async function getTurnoId(id:number): Promise<TurnoSalida | null> {    const turno = await prisma.turno.findUnique({
        where:{id}
    })
    return turno || null
}

async function getTurnoPorComplejo(complejoId:number): Promise<TurnoSalida[] | null>{
  const turnos = await prisma.turno.findMany({
    where: {complejoId}
  })
  return turnos 
  
}
async function verificarTurnoExistente(complejoId: number, canchaNro: number, fechaInicio: Date, fechaFin: Date): Promise<boolean> {
  const turnoExistente = await prisma.turno.findFirst({
    where: {
      complejoId,
      canchaNro,
      fechaInicio,
      fechaFin
    }
  });
  return !!turnoExistente;
}

async function postTurno(turno: Turno): Promise<TurnoSalida> {
  const datosValidados = turnoSchema.parse(turno);
  const ahora = new Date();
  if (datosValidados.fechaInicio < ahora) {
    throw new Error("No se pueden crear turnos para fechas u horarios pasados.");
  }
  const turnoExistente = await verificarTurnoExistente(datosValidados.complejoId, datosValidados.canchaNro, datosValidados.fechaInicio, datosValidados.fechaFin);
  if (turnoExistente) {
    throw new Error("Ya existe un turno en la misma cancha y horario.");
  }
  const nuevoTurno = await prisma.turno.create({
    data: {
      clienteId: datosValidados.clienteId,
      tipoTurnoId: datosValidados.tipoTurnoId,
      complejoId: datosValidados.complejoId,
      canchaNro: datosValidados.canchaNro,
      fechaInicio: datosValidados.fechaInicio,
      fechaFin: datosValidados.fechaFin,
      estado: datosValidados.estado,
      motivoCancelacion: datosValidados.motivoCancelacion ?? null,
      nombreSolicitante: datosValidados.nombreSolicitante ?? null,
      apellidoSolicitante: datosValidados.apellidoSolicitante ?? null,
    },
  });

  try {
    const turnoCompleto = await prisma.turno.findUnique({
      where: { id: nuevoTurno.id },
      include: {
        cliente: {
          include: {
            personaFisica: true,
            personaJuridica: true,
          },
        },
        complejo: true,
        cancha: {
          include: {
            tipoCancha: true,
          },
        },
      },
    });

    if (turnoCompleto) {
      void enviarEmailComprobanteReserva(turnoCompleto).catch((err) => {
        console.error("Error enviando comprobante de reserva:", err);
      });
    }
  } catch (err) {
    console.error("Error al obtener datos para enviar comprobante:", err);
  }
  return nuevoTurno;
}

// El encargado agenda un turno para un solicitante que puede no tener cuenta.
// No se crea (ni actualiza) ningún Usuario: el turno queda guardado con
// clienteId en null y los datos del solicitante en nombreSolicitante/apellidoSolicitante.
async function postTurnoComoEncargado(turno: Turno, cliente: { nombre: string; apellido: string; telefono?: string; email?: string }): Promise<TurnoSalida> {
  const datosValidados = turnoSchema.parse(turno);
  const ahora = new Date();
  if (datosValidados.fechaInicio < ahora) {
    throw new Error("No se pueden crear turnos para fechas u horarios pasados.");
  }
  const nuevoTurno = await prisma.turno.create({
    data: {
      clienteId: undefined,
      tipoTurnoId: datosValidados.tipoTurnoId,
      complejoId: datosValidados.complejoId,
      canchaNro: datosValidados.canchaNro,
      fechaInicio: datosValidados.fechaInicio,
      fechaFin: datosValidados.fechaFin,
      estado: datosValidados.estado,
      motivoCancelacion: datosValidados.motivoCancelacion ?? null,
      nombreSolicitante: cliente.nombre,
      apellidoSolicitante: cliente.apellido,
    },
  });

  return nuevoTurno;
}

async function getAllTurnos(filtros: FiltrosTurno = {}): Promise<TurnoSalida[]> {
  const { clienteId } = filtros;

  const turnos = await prisma.turno.findMany({
    where: clienteId && !isNaN(clienteId) ? { clienteId } : {},
    orderBy: [{ fechaInicio: 'asc' }],
    select: {
      id: true,
      fechaInicio: true,
      fechaFin: true,
      estado: true,
      clienteId: true,
      tipoTurnoId: true,
      complejoId: true,
      canchaNro: true,
      nombreSolicitante: true,
      apellidoSolicitante: true,

      complejo: {
        select: {
          nombre: true,
        },
      },

      cancha: {
        select: {
          nro: true,

          tipoCancha: {
            select: {
              deporte: true,
            },
          },
        },
      },
    },
  });

  return turnos;
}

async function putTurno(id: number, turnoNuevo: Partial<Turno>): Promise<TurnoSalida | null> {
  const datosValidados = turnoSchema.partial().parse(turnoNuevo);

  // Mapeamos los datos validados a las columnas de la BD
  const updateData: Record<string, any> = {};

  if (datosValidados.clienteId) updateData.clienteId = datosValidados.clienteId;
  if (datosValidados.tipoTurnoId) updateData.tipoTurnoId = datosValidados.tipoTurnoId;
  if (datosValidados.complejoId) updateData.complejoId = datosValidados.complejoId;
  if (datosValidados.canchaNro) updateData.canchaNro = datosValidados.canchaNro;
  if (datosValidados.estado) updateData.estado = datosValidados.estado;
  if (datosValidados.motivoCancelacion !== undefined) updateData.motivoCancelacion = datosValidados.motivoCancelacion;
  if (datosValidados.fechaInicio) {
    const ahora = new Date();
    if (datosValidados.fechaInicio < ahora) {
      throw new Error("No se puede modificar el turno a una fecha u horario pasado.");
    }
    updateData.fechaInicio = datosValidados.fechaInicio;
  }
  if (datosValidados.fechaFin) updateData.fechaFin = datosValidados.fechaFin;

  try {
    const turnoActualizado = await prisma.turno.update({
      where: { id },
      data: updateData,
    });

    return turnoActualizado;
  } catch (error) {
    return null;
  }
}

async function deleteTurno(id:number): Promise<boolean> {
    try{
        await prisma.turno.delete({
        where:{id}
    })
    return true;
    }catch(error){
        return false
    }
}

export async function getEstadisticasHoyDueno(duenoId: number) {
  const ahora = new Date();
  // Convertir "hoy" en Argentina (UTC-3) a rango UTC
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const hoyAR = formatter.format(ahora);
  const [year, month, day] = hoyAR.split('-').map(Number);
  // Inicio del día en AR = 00:00 AR = 03:00 UTC del mismo día
  const inicioHoyUTC = new Date(Date.UTC(year, month - 1, day, 3, 0, 0, 0));
  // Fin del día en AR = 23:59:59.999 AR = 02:59:59.999 UTC del día siguiente
  const finHoyUTC = new Date(Date.UTC(year, month - 1, day + 1, 2, 59, 59, 999));

  // 1. Ejecutamos las consultas en paralelo
  const [turnosHoy, canchasActivas] = await Promise.all([
    // Consultar turnos de hoy con tipoCancha para saber el deporte
    prisma.turno.findMany({
      where: {
        fechaInicio: { gte: inicioHoyUTC, lte: finHoyUTC },
        estado: { notIn: ['Cancelado', 'Cancelada'] },
        complejo: { duenoId },
        cancha: { estado: { notIn: ['Inactivo', 'Inactiva'] } },
      },
      include: {
        cancha: {
          include: {
            tipoCancha: true,
            precios: {
              orderBy: { fechaDesde: 'desc' },
              take: 1,
            },
          },
        },
      },
    }),

    // Consultar cantidad de canchas activas en total
    prisma.cancha.count({
      where: {
        complejo: { duenoId },
        estado: { notIn: ['Inactivo', 'Inactiva'] },
      },
    }),
  ]);

  // Calculo cantidad de turnos de hoy
  const cantidadTurnos = turnosHoy.length;

  //Calculo de ingresos hoy
  const ingresosEstimados = turnosHoy.reduce((total, turno) => {
    const ultimoPrecio = turno.cancha?.precios[0];
    const precioTurno = ultimoPrecio ? ultimoPrecio.precioBase.toNumber() : 0;
    return total + precioTurno;
  }, 0);
  // Cálculo del deporte estrella
  const conteoDeportes: Record<string, number> = {};
  turnosHoy.forEach((turno) => {
    const deporte = turno.cancha?.tipoCancha?.deporte || 'Sin especificar';
    conteoDeportes[deporte] = (conteoDeportes[deporte] || 0) + 1;
  });

  let deporteEstrella = 'Sin reservas';
  let maxReservas = 0;

  Object.entries(conteoDeportes).forEach(([deporte, cantidad]) => {
    if (cantidad > maxReservas) {
      maxReservas = cantidad;
      deporteEstrella = deporte;
    }
  });

  return {
    cantidadTurnos,
    ingresosEstimados,
    deporteEstrella: {
      nombre: deporteEstrella,
      reservas: maxReservas,
    },
  };
}
async function cancelarTurnoServicio(turnoId: number) {
  // 1. Buscamos el turno en la base de datos
  const turno = await getTurnoId(turnoId);

  if (!turno) {
    throw new Error('El turno no fue encontrado.');
  }
  if (turno.estado.toLowerCase() !== 'reservado') {
    throw new Error('Solo se pueden cancelar turnos que se encuentren en estado reservado.');
  }
  const turnoActualizado = await prisma.turno.update({
    where: { id: turnoId },
    data: { estado: 'Cancelado' },
  });

  return turnoActualizado;
}


export {
    getTurnoId,
    getTurnoPorComplejo,
    postTurno,
    postTurnoComoEncargado,
    getAllTurnos,
    putTurno,
    deleteTurno,
    cancelarTurnoServicio
}