import { turnoSchema, type Turno } from "./turno.schema.js";
import { prisma } from "../shared/prisma.js";
import { fa } from "zod/locales";
import bcrypt from "bcryptjs";
import { enviarEmailResetPassword } from "../auth/auth.service.js";

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


function normalizarFechaHora(valor: string | Date): Date {
  if (valor instanceof Date) return valor;
  
  // Si viene en formato "HH:mm" (ej: "18:00")
  if (/^\d{2}:\d{2}$/.test(valor)) {
    return new Date(`1970-01-01T${valor}:00.000Z`);
  }
  
  return new Date(valor);
}


async function getTurnoId(id:number): Promise<TurnoSalida | null> {
    const turno = await prisma.turno.findUnique({
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
async function postTurno(turno: Turno): Promise<TurnoSalida> {
  const datosValidados = turnoSchema.parse(turno);
  const nuevoTurno = await prisma.turno.create({
    data: {
      clienteId: datosValidados.clienteId,
      tipoTurnoId: datosValidados.tipoTurnoId,
      complejoId: datosValidados.complejoId,
      canchaNro: datosValidados.canchaNro,
      fecha:datosValidados.fecha,
      horaInicio: normalizarFechaHora(datosValidados.horaInicio),
      horaFin: normalizarFechaHora(datosValidados.horaFin),
      estado: datosValidados.estado,
      motivoCancelacion: datosValidados.motivoCancelacion ?? null,
    },
  });

  return nuevoTurno;
}

async function postTurnoComoEncargado(turno: Turno, cliente: { nombre: string; apellido: string; telefono: string; email: string }): Promise<TurnoSalida> {
  const datosValidados = turnoSchema.omit({ clienteId: true }).parse(turno);
  const clienteExistente = await prisma.usuario.findUnique({ where: { email: cliente.email } });
  let clienteId = clienteExistente?.id;
  let cuentaCreada = false;

  if (!clienteId) {
    const dni = `TEMP${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const persona = await prisma.personaFisica.create({
      data: {
        dni,
        nombre: cliente.nombre,
        apellido: cliente.apellido,
        fechaNacimiento: new Date("1900-01-01"),
      },
    });
    const password = await bcrypt.hash(`${dni}-${cliente.email}`, 10);
    const nuevoCliente = await prisma.usuario.create({
      data: {
        email: cliente.email,
        telefono: cliente.telefono,
        password,
        tipoUsuarioId: 3,
        personaFisicaDni: persona.dni,
      },
    });
    clienteId = nuevoCliente.id;
    cuentaCreada = true;
  }

  if (cuentaCreada) {
    try {
      await enviarEmailResetPassword(cliente.email, clienteId);
    } catch (error) {
      console.error("No se pudo enviar el enlace para definir la contraseña:", error);
    }
  }

  return prisma.turno.create({
    data: {
      clienteId,
      tipoTurnoId: datosValidados.tipoTurnoId,
      complejoId: datosValidados.complejoId,
      canchaNro: datosValidados.canchaNro,
      fecha: datosValidados.fecha,
      horaInicio: normalizarFechaHora(datosValidados.horaInicio),
      horaFin: normalizarFechaHora(datosValidados.horaFin),
      estado: datosValidados.estado,
      motivoCancelacion: datosValidados.motivoCancelacion ?? null,
    },
  });
}

async function getAllTurnos(filtros: FiltrosTurno = {}): Promise<TurnoSalida[]> {
  const { clienteId } = filtros;

  const turnos = await prisma.turno.findMany({
    where: clienteId && !isNaN(clienteId) ? { clienteId } : {},
    orderBy: [
    { fecha: 'desc' },       
    { horaInicio: 'desc' }   
    ],
    select: {
    id: true,
    horaInicio: true, 
    horaFin: true,    
    fecha: true,
    estado: true,
    clienteId: true,
    tipoTurnoId: true,
    complejoId: true,
    canchaNro: true,
    
    complejo: {
      select: {
        nombre: true,
      }
    },

    cancha: {
      select: {
        nro: true,
        
        tipoCancha: {
          select: {
            deporte: true,

          }
        }
      }
    }
  },
  });

  return turnos;
}

async function putTurno(id: number, turnoNuevo: Partial<Turno>): Promise<TurnoSalida | null> {
  const datosValidados = turnoSchema.partial().parse(turnoNuevo);

  // Mapeamos los datos validados a las columnas de la BD
  const updateData: Record<string, any> = {};

  if (datosValidados.clienteId) updateData.id_cliente = datosValidados.clienteId;
  if (datosValidados.tipoTurnoId) updateData.id_tipoTurno = datosValidados.tipoTurnoId;
  if (datosValidados.complejoId) updateData.id_complejo = datosValidados.complejoId;
  if (datosValidados.canchaNro) updateData.nro_cancha = datosValidados.canchaNro;
  if (datosValidados.estado) updateData.estado = datosValidados.estado;
  if (datosValidados.motivoCancelacion !== undefined) updateData.motivoCancelacion = datosValidados.motivoCancelacion;
  
  if (datosValidados.horaInicio) updateData.horarioInicio = normalizarFechaHora(datosValidados.horaInicio);
  if (datosValidados.horaFin) updateData.horarioFin = normalizarFechaHora(datosValidados.horaFin);

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
  const hoyInicio = new Date();
  hoyInicio.setHours(0, 0, 0, 0);

  const hoyFin = new Date();
  hoyFin.setHours(23, 59, 59, 999);

  // 1. Ejecutamos las consultas en paralelo
  const [turnosHoy, canchasActivas] = await Promise.all([
    // Consultar turnos de hoy con tipoCancha para saber el deporte
    prisma.turno.findMany({
      where: {
        fecha: { gte: hoyInicio, lte: hoyFin },
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

export {
    getTurnoId,
    getTurnoPorComplejo,
    postTurno,
    postTurnoComoEncargado,
    getAllTurnos,
    putTurno,
    deleteTurno
}