import { prisma } from '../shared/prisma.js';
import { PrismaClient, type TipoCancha } from '@prisma/client';

async function getTipoCanchaId(id: number): Promise<TipoCancha | null> {
    return await prisma.tipoCancha.findUnique({
        where: { id }
    });
}

async function getAllTipoCanchas(): Promise<TipoCancha[]> {
    return await prisma.tipoCancha.findMany();
}

export {
    getTipoCanchaId,
    getAllTipoCanchas
}