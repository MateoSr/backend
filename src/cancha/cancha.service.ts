import { prisma } from '../shared/prisma.js'
import { canchaSchema } from './cancha.schema.js'

async function getCanchaNro(nro: number, id_complejo: number) {
    return await prisma.cancha.findFirst({
        where: { 
            complejo: {
                id: id_complejo
            },
            nro: nro 
        }
    })
}

async function postCancha(canchaData: unknown, id_complejo: number) {
    const datosValidados = canchaSchema.parse(canchaData);

    const nuevaCancha = await prisma.cancha.create({
        data: {
            tipoCanchaId: datosValidados.tipoCanchaId,
            complejoId: id_complejo,
            nro: datosValidados.nro
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

async function putCancha(nro: number, id_complejo: number, canchaNueva: unknown) {
    const datosValidados = canchaSchema.partial().parse(canchaNueva);
    try {
        const canchaActualizada = await prisma.cancha.update({
            where: {
                complejoId_nro: {
                    complejoId: id_complejo,
                    nro: nro
                }
            },
            data: {
                tipoCanchaId: datosValidados.tipoCanchaId
            }
        });
        return canchaActualizada;
    } catch (error) {
        return null;
    }
}

async function deleteCancha(nro: number, id_complejo: number): Promise<boolean> {
    try {
        await prisma.cancha.delete({
            where: {
                complejoId_nro: {
                    complejoId: id_complejo,
                    nro: nro
                }
            }
        });
        return true;
    } catch (error) {
        return false;
    }
}

export {
    getCanchaNro,
    postCancha,
    getAllCanchas,
    putCancha,
    deleteCancha
}