import { type Complejo } from "./complejos.schema.js";
import { prisma } from "../shared/prisma.js";


export interface ComplejoSalida extends Complejo {
    id: number;
    estado: string;
}
interface BusquedaFiltros {
  ciudad?: string;
  deporte?: string;
  fecha?: string;
  hora?: string;
  min?: number;
  max?: number;
  sort?: string;
  page?: number;
  limit?: number;
}

function ordenarComplejos(resultados: any[], sort: string): any[] {
  const ordenados = [...resultados];
  switch (sort) {
    case "precio_menor":
      return ordenados.sort((a, b) => a.precio - b.precio);
    case "precio_mayor":
      return ordenados.sort((a, b) => b.precio - a.precio);
    case "nombre_az":
      return ordenados.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
    case "nombre_za":
      return ordenados.sort((a, b) => b.nombre.localeCompare(a.nombre, "es"));
    default:
      return ordenados;
  }
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

// Minutos desde medianoche en horario Argentina (UTC-3) para un instante UTC.
function minutosArgentina(instante: Date): number {
  const enArgentina = new Date(instante.getTime() - 3 * 60 * 60 * 1000);
  return enArgentina.getUTCHours() * 60 + enArgentina.getUTCMinutes();
}

//funcion de ayuda para los minutos de los horarios
function obtenerMinutosDesdeMedianoche(hora: Date | string): number {
  if (hora instanceof Date) {
    return hora.getUTCHours() * 60 + hora.getUTCMinutes();
  }
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + m;
}


async function getComplejoId(id: number): Promise<ComplejoSalida | null> {
  const complejo = await prisma.complejo.findUnique({
    where: { id },
    include: {
      localidad: true,
      horarios: true,
      opiniones: {
        orderBy: { fecha: 'desc' },
      },
      canchas: {
        include: {
          tipoCancha: true,
          turnos: {
            where: {
              estado: { notIn: ["Cancelado", "Cancelada"] },
            },
          },
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
            where: { estado: { notIn: ["Cancelado", "Cancelada"] } },
            orderBy: [{ fechaInicio: "asc" }],
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
async function getComplejoDelDueno(duenoId: number) {
  const complejos = await prisma.complejo.findMany({
    where: { duenoId },
    include: {
      localidad: true,
      canchas: {
        where: { estado: { not: 'Inactivo' } },
        include: {
          tipoCancha: true
        }
      }
    }
  });

  return complejos.map((complejo) => {
    // Extraemos los nombres de tipoCancha y eliminamos duplicados con Set
    const deportesUnicos = Array.from(
      new Set(complejo.canchas.map((cancha) => cancha.tipoCancha.deporte))
    );

    return {
      ...complejo,
      deportes: deportesUnicos
    };
  });
}
async function postComplejo(complejo: Complejo): Promise<ComplejoSalida> {
  const nuevoComplejo = await prisma.complejo.create({
    data: {
      ...complejo,
      estado: "Activo"
    }
  });

  return nuevoComplejo;
}
async function getAllComplejos(): Promise<ComplejoSalida[]> {
  const complejos = await prisma.complejo.findMany();
  return complejos;
}

async function putComplejo(id: number, complejoNuevo: Partial<Complejo>): Promise<ComplejoSalida | null> {
  try {
    // Prisma actualiza directamente sin tener que buscar el índice
    const complejoActualizado = await prisma.complejo.update({
      where: { id },
      data: complejoNuevo
    });
    return complejoActualizado;
  } catch (error) {
    // Si el ID no existe, Prisma lanza un error (P2025) y retornamos null para mantener tu firma original
    return null;
  }
}

async function bajaComplejo(id: number): Promise<ComplejoSalida | null> {
  try {
    const complejo = await prisma.complejo.update({
      where: { id },
      data: { estado: "Inactivo" }
    });
    return complejo;
  } catch (error) {
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

async function buscarComplejosDisponibles(filtros: BusquedaFiltros): Promise<{ total: number; data: any[] }> {
  //agarramos filtros
  const { ciudad, deporte, fecha, hora, min = 0, max = Infinity, sort = "relevantes", page = 1, limit = 12 } = filtros;
  const ciudadNormalizada = ciudad?.trim();

  //convertimos a fechas (fecha/hora se interpretan como hora local Argentina UTC-3)
  const fechaDate = fecha ? new Date(`${fecha}T00:00:00.000Z`) : new Date();
  const buscaDisponibilidad = Boolean(deporte && fecha && hora);
  // Rango UTC del día Argentina para filtrar turnos por fechaInicio
  const inicioDiaUTC = fecha
    ? new Date(`${fecha}T00:00:00-03:00`)
    : null;
  const finDiaUTC = fecha
    ? new Date(inicioDiaUTC!.getTime() + 24 * 60 * 60 * 1000)
    : null;
  // Instante UTC del inicio pedido (fecha + hora en horario Argentina)
  const inicioPedidoUTC = buscaDisponibilidad
    ? new Date(`${fecha}T${hora}:00-03:00`)
    : null;

  //inicio de la query
  const complejosDisponibles = await prisma.complejo.findMany({
    where: {
      estado: { not: "Inactivo" },
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
            estado: {
              notIn: ['Inactivo', 'Inactiva'],
            },
            //buscamos alguna con el id deporte del filtro
            tipoCanchaId: Number(deporte),
            ...(buscaDisponibilidad ? {
              turnos: {
                //si no hay un turno que empiece en el horario pedido
                none: {
                  fechaInicio: inicioPedidoUTC!,
                  estado: {
                    notIn: ["Cancelado", "Cancelada"],
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
          estado: {
            notIn: ['Inactivo', 'Inactiva'],
          },
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
          // traemos todos los turnos del día (en horario Argentina) para calcular las horas libres
          turnos: {
            where: {
              ...(inicioDiaUTC && finDiaUTC
                ? { fechaInicio: { gte: inicioDiaUTC, lt: finDiaUTC } }
                : {}),
              estado: {
                notIn: ["Cancelado", "Cancelada"],
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

      const inicio = minutosDesdeHora(hora!);
      const duracion = Number(cancha.tipoCancha?.duracion) || 60;
      const fin = inicio + duracion;
      const tieneHorario = inicio >= apertura && fin <= cierre;
      const tieneTurno = cancha.turnos.some((turno) => {
        const turnoInicio = minutosArgentina(turno.fechaInicio);
        let turnoFin = minutosArgentina(turno.fechaFin);
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
        const turnoInicio = minutosArgentina(turno.fechaInicio);
        let turnoFin = minutosArgentina(turno.fechaFin);
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

  const filtrados = resultados.filter((complejo) => complejo.precio >= min && complejo.precio <= max);
  const ordenados = ordenarComplejos(filtrados, sort);
  const total = ordenados.length;
  const inicio = (page - 1) * limit;
  const data = ordenados.slice(inicio, inicio + limit);

  return { total, data };
}

async function getTurnosPosiblesPorDia(complejoId: number, fecha: Date): Promise<number> {
  // obtenemos nro del dia de hoy
  const nroDia = fecha.getDay();

  // query
  const complejo = await prisma.complejo.findUnique({
    where: { id: complejoId },
    include: {
      canchas: {
        where: {
          estado: { notIn: ['Inactivo', 'Inactiva'] },
        },
        include:{
          tipoCancha:true
        }
      },
      // horario del nro de hoy
      horarios: {
        where: {
          nroDia: nroDia,
        },
      },
    },
  });

  const horarioDelDia = complejo?.horarios[0];

  // si no hay complejo/canchas/horarios
  if (!complejo || complejo.estado === "Inactivo" || complejo.canchas.length === 0 || !horarioDelDia) {
    return 0;
  }
  // duracion turno
  const duracionTurnoMinutos = 60

 const minutosApertura = obtenerMinutosDesdeMedianoche(horarioDelDia.horaApertura);
 let minutosCierre = obtenerMinutosDesdeMedianoche(horarioDelDia.horaCierre);

  // Si cierra pasadas las 00:00 hs (ej: abre 18:00 y cierra 02:00)
  if (minutosCierre <= minutosApertura) {
    minutosCierre += 24 * 60;
  }

  // 5. Calcular turnos totales por cancha y multiplicar por las canchas activas
  const minutosAbierto = minutosCierre - minutosApertura;
  const turnosPorCancha = Math.floor(minutosAbierto / duracionTurnoMinutos);

  return turnosPorCancha * complejo.canchas.length;
}

async function getCapacidadTotalDuenoPorDia(duenoId: number,fecha: Date = new Date()): Promise<number> {
  // todos complejos del dueno
  const complejos = await prisma.complejo.findMany({
    where: { duenoId: duenoId, estado: { not: "Inactivo" } },
    select: { id: true },
  });
  // no hay complejo da error
  if (complejos.length === 0) {
    return 0;
  }

  // calculo capacidad de cada complejos con getTurnosPosiblesPorDia
  const capacidades = await Promise.all(
    complejos.map((complejo) => getTurnosPosiblesPorDia(complejo.id, fecha))
  );

  // sumar las capacidades 
  const capacidadTotal = capacidades.reduce((total, capacidadComplejo) => {
    return total + capacidadComplejo;
  }, 0);

  return capacidadTotal;
}
const ZONA_COMPLEJO_POR_DEFECTO = "America/Argentina/Buenos_Aires";

async function getDisponibilidadComplejo(complejoId: number, fecha: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    throw new Error("Fecha inválida. Formato esperado YYYY-MM-DD");
  }

  const inicioDiaUTC = new Date(`${fecha}T00:00:00-03:00`);
  if (isNaN(inicioDiaUTC.getTime())) {
    throw new Error("Fecha inválida.");
  }
  const finVentanaUTC = new Date(inicioDiaUTC.getTime() + 48 * 60 * 60 * 1000);

  const complejo = await prisma.complejo.findUnique({
    where: { id: complejoId },
    include: {
      horarios: true,
      canchas: {
        where: { estado: { notIn: ["Inactivo", "Inactiva"] } },
        include: {
          tipoCancha: true,
          turnos: {
            where: {
              estado: { notIn: ["Cancelado", "Cancelada"] },
              AND: [
                { fechaInicio: { lt: finVentanaUTC } },
                { fechaFin: { gt: inicioDiaUTC } },
              ],
            },
          },
        },
      },
    },
  });

  if (!complejo || complejo.estado === "Inactivo") {
    throw new Error("El complejo no está disponible");
  }

  const zona = ZONA_COMPLEJO_POR_DEFECTO;
  const dia = new Date(`${fecha}T00:00:00Z`).getUTCDay() || 7;
  const horario = complejo.horarios.find((h) => h.nroDia === dia);

  const base = {
    complejoId: complejo.id,
    timezone: zona,
    fecha,
    abierto: false,
    duracionGrilla: 0,
    columnas: [] as Array<{ inicio: string; fin: string; pasado: boolean }>,
    canchas: [] as Array<{
      nro: number;
      deporte: string;
      duracion: number;
      celdas: Array<{ disponible: boolean; turnoId: number | null }>;
    }>,
  };

  if (!horario) return base;

  const canchas = complejo.canchas;
  if (canchas.length === 0) return { ...base, abierto: true };

  const apertura = obtenerMinutosDesdeMedianoche(horario.horaApertura);
  let cierre = obtenerMinutosDesdeMedianoche(horario.horaCierre);
  if (cierre <= apertura) cierre += 24 * 60;

  const duracionGrilla = Math.min(
    ...canchas.map((c) => Number(c.tipoCancha?.duracion) || 60),
    60
  );
  const totalBloques = Math.floor((cierre - apertura) / duracionGrilla);

  if (totalBloques <= 0) return { ...base, abierto: true };

  const ahora = new Date();
  const baseMs = inicioDiaUTC.getTime();

  const columnas = Array.from({ length: totalBloques }, (_, i) => {
    const inicioMin = apertura + i * duracionGrilla;
    const finMin = Math.min(inicioMin + duracionGrilla, cierre);
    const inicio = new Date(baseMs + inicioMin * 60 * 1000);
    const fin = new Date(baseMs + finMin * 60 * 1000);
    return {
      inicio: inicio.toISOString(),
      fin: fin.toISOString(),
      pasado: inicio < ahora,
    };
  });

  const canchasResp = canchas.map((cancha) => {
    const duracion = Number(cancha.tipoCancha?.duracion) || 60;
    const celdas = columnas.map((col) => {
      const inicio = new Date(col.inicio);
      const fin = new Date(col.fin);
      const turno = (cancha.turnos ?? []).find((t) => {
        const tInicio = new Date(t.fechaInicio);
        const tFin = new Date(t.fechaFin);
        return tInicio < fin && tFin > inicio;
      });
      return {
        disponible: !turno,
        turnoId: turno?.id ?? null,
      };
    });
    return {
      nro: cancha.nro,
      deporte: cancha.tipoCancha?.deporte ?? "Deporte no especificado",
      duracion,
      celdas,
    };
  });

  return {
    complejoId: complejo.id,
    timezone: zona,
    fecha,
    abierto: true,
    duracionGrilla,
    columnas,
    canchas: canchasResp,
  };
}

export {
    getComplejoId,
    getDisponibilidadComplejo,
    getComplejoDelEncargado,
    getComplejoDelDueno,
    postComplejo,
    getAllComplejos,
    putComplejo,
    bajaComplejo,
    deleteComplejo,
    buscarComplejosDisponibles,
    getCapacidadTotalDuenoPorDia
}