import { complejoSchema,type Complejo } from "./complejos.schema.js";
import { proximoId } from "../shared/funciones.js";
import { prisma } from "../shared/prisma.js";

export interface ComplejoSalida extends Complejo {
    id: number;
}
interface BusquedaFiltros {
  ciudad: string;
  deporte: string;
  fecha: string; 
  hora: string;  
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
        },
      },
    },
  });
  return complejo;
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
  const { ciudad, deporte, fecha, hora } = filtros; 

  //convertimos a fechas
  const fechaDate = new Date(`${fecha}T00:00:00.000Z`);
  const horaInicioDate = new Date(`1970-01-01T${hora}:00.000Z`);

  //inicio de la query
  const complejosDisponibles = await prisma.complejo.findMany({
    where: {
      //buscamos la localidad correspondiente
      localidad: {
        nombre: {
          equals: ciudad,
          mode: "insensitive",
        },
      },
      //entramos a las canchas
      canchas: {
        some: {
          //buscamos alguna con el id deporte del filtro
          tipoCanchaId: Number(deporte),
          //entramos a los turnos de la cancha
          turnos: {
            //si no hay un turno para la fecha y hora 
            none: {
              fecha: fechaDate,
              horaInicio: horaInicioDate,
              estado: {
                not: "CANCELADO",
              },
            },
          },
        },
      },
    },
    //con el include traemos la localidad,y las canchas que tengan disponibilidad
    include: {
      localidad: true,
      canchas: {
        where: {
          tipoCanchaId: Number(deporte),
          turnos: {
            none: {
              fecha: fechaDate,
              horaInicio: horaInicioDate,
              estado: {
                not: "CANCELADO",
              },
            },
          },
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

  // Grilla base de horarios (se puede ajustar según los horarios del complejo)
  const todosLosHorarios = [
    "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", 
    "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"
  ];

  // Mapeamos los datos para devolver la estructura limpia que pide el Frontend
  return complejosDisponibles.map((complejo) => {
    //toma la primer cancha encontra
    const cancha = complejo.canchas[0];
    //obtenemos el precio de esa cancha
    const precioVigente = cancha?.precios[0]?.precioBase ?? 0;

    // Extraemos las horas que están ocupadas ese día
    const horasOcupadas = cancha?.turnos.map((t) => 
      t.horaInicio.toISOString().substring(11, 16)
    ) || [];

    // Filtramos las horas libres excluyendo las ocupadas
    const horariosLibres = todosLosHorarios.filter(
      (h) => !horasOcupadas.includes(h)
    );

    //ajustamos lo q devuelve para coincidir con lo que requiere el front
    return {
      id: complejo.id,
      nombre: complejo.nombre,
      direccion: `${complejo.direccion}, ${complejo.localidad.nombre}`,
      precio: precioVigente,
      imagenUrl: complejo.imagenUrl ?? "https://via.placeholder.com/300x200",
      disponibilidad: horariosLibres.map((h) => ({ time: h })),
    };
  });
}
export {
    getComplejoId,
    postComplejo,
    getAllComplejos,
    putComplejo,
    deleteComplejo,
    buscarComplejosDisponibles
}