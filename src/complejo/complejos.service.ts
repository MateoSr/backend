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
    where: { id }
  });
  return complejo;
}

async function postComplejo(complejo: Complejo): Promise<ComplejoSalida> {
  // 1. Validamos los datos recibidos con Zod
  const datosValidados = complejoSchema.parse(complejo);

  // 2. Prisma maneja el ID autonumérico automáticamente
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

async function buscarComplejosDisponibles(filtros: BusquedaFiltros): Promise<ComplejoSalida[]> {
    const { ciudad, deporte, fecha, hora } = filtros;
  const fechaHoraInicio = new Date(`${fecha}T${hora}:00`);

  const complejosDisponibles = await prisma.complejo.findMany({
    where: {
      // 1. Filtrar por Localidad
      localidad: {
        nombre: {
          equals: ciudad,
          mode: 'insensitive',
        },
      },
      // 2. Filtrar por Canchas que tengan el deporte pedido
      canchas: {
        some: {
          tipoCancha: {
            deporte: {
              equals: deporte,
              mode: 'insensitive',
            },
          },
          // 3. Que NO tengan un turno ocupado ese día a esa hora
          turno: {
            none: {
              fecha: fechaHoraInicio,
              horaInicio: hora,
              estado: {
                not: 'Cancelado',
              },
            },
          },
        },
      },
    },
    include: {
      localidad: true,
      canchas: {
        where: {
          tipoCancha: {
            deporte: {
              equals: deporte,
              mode: 'insensitive',
            },
          },
        },
        include: {
          tipoCancha: true,
        },
      },
    },
  });
  return complejosDisponibles;
}
export {
    getComplejoId,
    postComplejo,
    getAllComplejos,
    putComplejo,
    deleteComplejo,
    buscarComplejosDisponibles
}