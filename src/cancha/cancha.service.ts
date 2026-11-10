import { prisma } from '../shared/prisma.js'
import { type Cancha } from './cancha.schema.js'

async function getCanchaNro(nro: number, id_complejo: number) {
    return await prisma.cancha.findFirst({
        where: { 
            complejo: {
                id: id_complejo
            },
            nro: nro 
        },
        include: {
            tipoCancha: true,
            precios: {orderBy: {fechaDesde: 'desc'}, take: 1}
        }
    })
}

async function postCancha(canchaData: Cancha, id_complejo: number) {
    const nuevaCancha = await prisma.cancha.create({
        data: {
            tipoCanchaId: canchaData.tipoCanchaId,
            complejoId: id_complejo,
            nro: canchaData.nro
        }
    });
    return nuevaCancha;
}

async function getAllCanchas(id_complejo: number) {
    return await prisma.cancha.findMany({
        where: { complejoId: id_complejo },
        include: { tipoCancha: true }
    });
}

async function putCancha(nro: number, id_complejo: number, canchaNueva: Partial<Cancha>) {
    try {
        const canchaActualizada = await prisma.cancha.update({
            where: {
                complejoId_nro: {
                    complejoId: id_complejo,
                    nro: nro
                }
            },
            data: {
                tipoCanchaId: canchaNueva.tipoCanchaId,
                estado: canchaNueva.estado
            }
        });
        return canchaActualizada;
    } catch (error) {
        return null;
    }
}

async function deleteCancha(nro: number, id_complejo: number): Promise<boolean> {
    try {
    await prisma.cancha.update({
      where: {
        complejoId_nro: {
          complejoId: id_complejo,
          nro: nro,
        },
      },
      data: {
        estado: "Inactivo", 
      }as any,
    });
    return true;
  } catch (error) {
    console.error("Error al desactivar la cancha:", error);
    throw error;
  }
}

async function getCantidadCanchasTotalesDueno(duenoId: number): Promise<number> {
  return await prisma.cancha.count({
    where: {
      estado: { notIn: ['Inactivo', 'Inactiva'] },
      complejo: { duenoId: duenoId, estado: { not: 'Inactivo' } },
    },
  });
}

export {
    getCanchaNro,
    postCancha,
    getAllCanchas,
    putCancha,
    deleteCancha,
    getCantidadCanchasTotalesDueno
}