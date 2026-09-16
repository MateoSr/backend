import { complejoSchema,type Complejo } from "./complejos.schema.js";
import { prisma } from "../shared/prisma.js";

export interface ComplejoSalida extends Complejo {
    id: number;
}
interface BusquedaFiltros {
  ciudad?: string;
  deporte?: string;
  fecha?: string;
  hora?: string;
  min?: number;
  max?: number;
}

function minutosDesdeHora(valor: Date | string): number {
  if (valor instanceof Date) {
    return valor.getUTCHours() * 60 + valor.getUTCMinutes();
  }

  const coincidencia = valor.match(/(?:T|^)(\d{1,2}):(\d{2})/);
  return coincidencia ? Number(coincidencia[1]) * 60 + Number(coincidencia[2]) : 0;
}

function diaDeLaSemana(fecha: Date): number {
  const dia = fecha.getUTCDay();
  return dia === 0 ? 7 : dia;
}


async function getComplejoId(id: number): Promise<ComplejoSalida | null> {
  const complejo = await prisma.complejo.findUnique({
    where: { id },
    include: {
      localidad: true,
      horarios: true,
      canchas: {
        include: {
          tipoCancha: true,
          turnos: true,
          precios: {
            orderBy: {
              fechaDesde: 'desc', // Ordena del más reciente al más antiguo
            },
            take: 1, // Trae únicamente el primero (el más nuevo)
          },
        },
      },
    },
  });
  return complejo;
}

async function getComplejoDelEncargado(encargadoId: number) {
  return prisma.complejo.findUnique({
    where: { encargadoId },
    include: {
      localidad: true,
      horarios: true,
      canchas: {
        include: {
          tipoCancha: true,
          turnos: {
            where: { estado: { not: "CANCELADO" } },
            orderBy: [{ fecha: "asc" }, { horaInicio: "asc" }],
            include: {
              cliente: {
                select: {
                  email: true,
                  telefono: true,
                  personaFisica: {
                    select: { nombre: true, apellido: true },
                  },
                  personaJuridica: {
                    select: { razonSocial: true },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
}

async function postComplejo(complejo: Complejo): Promise<ComplejoSalida> {
  const datosValidados = complejoSchema.parse(complejo);

  const nuevoComplejo = await prisma.complejo.create({
    data: datosValidados
  });

  return nuevoComplejo;
}
async function getAllComplejos(): Promise<ComplejoSalida[]> {
  const complejos = await prisma.complejo.findMany();
  return complejos;
}

async function putComplejo(id: number, complejoNuevo: Partial<Complejo>): Promise<ComplejoSalida | null> {
  // 1. Validamos que los campos opcionales tengan tipos correctos
  const datosValidados = complejoSchema.partial().parse(complejoNuevo);

  try {
    // 2. Prisma actualiza directamente sin tener que buscar el índice
    const complejoActualizado = await prisma.complejo.update({
      where: { id },
      data: datosValidados
    });
    return complejoActualizado;
  } catch (error) {
    // Si el ID no existe, Prisma lanza un error (P2025) y retornamos null para mantener tu firma original
    return null;
  }
}

async function deleteComplejo(id: number): Promise<boolean> {
  try {
    await prisma.complejo.delete({
      where: { id }
    });
    return true;
  } catch (error) {
    // Si el registro no existía, devolvemos false
    return false;
  }
}

async function buscarComplejosDisponibles(filtros: BusquedaFiltros): Promise<any[]> {
  //agarramos filtros
  const { ciudad, deporte, fecha, hora, min = 0, max = Infinity } = filtros;
  const ciudadNormalizada = ciudad?.trim();

  //convertimos a fechas
  const fechaDate = fecha ? new Date(`${fecha}T00:00:00.000Z`) : new Date();
  const buscaDisponibilidad = Boolean(deporte && fecha && hora);
  const horaInicioDate = hora ? new Date(`1970-01-01T${hora}:00.000Z`) : null;

  //inicio de la query
  const complejosDisponibles = await prisma.complejo.findMany({
    where: {
      //buscamos la localidad correspondiente
      ...(ciudadNormalizada ? {
        localidad: {
          nombre: {
            contains: ciudadNormalizada,
            mode: "insensitive",
          },
        },
      } : {}),
      //entramos a las canchas
      ...(deporte ? {
        canchas: {
          some: {
            //buscamos alguna con el id deporte del filtro
            tipoCanchaId: Number(deporte),
            ...(buscaDisponibilidad ? {
              turnos: {
                //si no hay un turno para la fecha y hora
                none: {
                  fecha: fechaDate,
                  horaInicio: horaInicioDate!,
                  estado: {
                    not: "CANCELADO",
                  },
                },
              },
            } : {}),
          },
        },
      } : {}),
    },
    //con el include traemos la localidad,y las canchas que tengan disponibilidad
    include: {
      localidad: true,
      horarios: true,
      canchas: {
        where: {
          ...(deporte ? { tipoCanchaId: Number(deporte) } : {}),
        },
        include: {
          tipoCancha: true,
          //traemos los precios para obtener el más reciente
          precios: {
            where: {
              fechaDesde: {
                lte: fechaDate, // menor o igual a la fecha buscada
              },
            },
            //ordebnamos mas reciente a viejo
            orderBy: {
              fechaDesde: "desc",
            },
            //tomamos 1 solo
            take: 1,
          },
          // traemos todos los turnos del día para calcular las horas libres
          turnos: {
            where: {
              fecha: fechaDate,
              estado: {
                not: "CANCELADO",
              },
            },
          },
        },
      },
    },
  });

  // Mapeamos los datos para devolver la estructura limpia que pide el Frontend
  const resultados = complejosDisponibles.flatMap((complejo) => {
    const horario = complejo.horarios.find((item) => item.nroDia === diaDeLaSemana(fechaDate));
    if (!horario) return [];

    const apertura = minutosDesdeHora(horario.horaApertura);
    let cierre = minutosDesdeHora(horario.horaCierre);
    if (cierre <= apertura) cierre += 24 * 60;

    const canchasDisponibles = complejo.canchas.filter((cancha) => {
      if (!buscaDisponibilidad) return true;

      const inicio = minutosDesdeHora(horaInicioDate!);
      const duracion = Number(cancha.tipoCancha?.duracion) || 60;
      const fin = inicio + duracion;
      const tieneHorario = inicio >= apertura && fin <= cierre;
      const tieneTurno = cancha.turnos.some((turno) => {
        const turnoInicio = minutosDesdeHora(turno.horaInicio);
        let turnoFin = minutosDesdeHora(turno.horaFin);
        if (turnoFin <= turnoInicio) turnoFin += 24 * 60;
        return inicio < turnoFin && fin > turnoInicio;
      });
      return tieneHorario && !tieneTurno;
    });

    if (canchasDisponibles.length === 0) return [];

    const cancha = canchasDisponibles[0];
    //obtenemos el precio de esa cancha
    const precioVigente = Number(cancha?.precios[0]?.precioBase ?? 0);

    const duracion = Number(cancha.tipoCancha?.duracion) || 60;
    const horariosLibres = [];
    for (let inicio = apertura; inicio + duracion <= cierre; inicio += duracion) {
      const fin = inicio + duracion;
      const ocupado = cancha.turnos.some((turno) => {
        const turnoInicio = minutosDesdeHora(turno.horaInicio);
        let turnoFin = minutosDesdeHora(turno.horaFin);
        if (turnoFin <= turnoInicio) turnoFin += 24 * 60;
        return inicio < turnoFin && fin > turnoInicio;
      });
      if (!ocupado) {
        const horas = String(Math.floor(inicio / 60) % 24).padStart(2, "0");
        const minutos = String(inicio % 60).padStart(2, "0");
        horariosLibres.push(`${horas}:${minutos}`);
      }
    }

    //ajustamos lo q devuelve para coincidir con lo que requiere el front
    return [{
      id: complejo.id,
      nombre: complejo.nombre,
      direccion: `${complejo.direccion}, ${complejo.localidad.nombre}`,
      precio: precioVigente,
      imagenUrl: complejo.imagenUrl ?? "https://via.placeholder.com/300x200",
      instagram: complejo.instagram ?? null,
      telefono: complejo.telefono
    }];
  });

  return resultados.filter((complejo) => complejo.precio >= min && complejo.precio <= max);
}
export {
    getComplejoId,
  getComplejoDelEncargado,
    postComplejo,
    getAllComplejos,
    putComplejo,
    deleteComplejo,
    buscarComplejosDisponibles
}