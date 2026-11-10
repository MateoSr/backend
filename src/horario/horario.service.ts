import { prisma } from '../shared/prisma.js'
import { type Horario } from './horario.schema.js'

async function getHorarios(complejoId: number) {
    return await prisma.horario.findMany({
        where: { complejoId },
        orderBy: { nroDia: 'asc' }
    });
}

async function getHorario(complejoId: number, nroDia: number) {
    return await prisma.horario.findUnique({
        where: {
            complejoId_nroDia: {
                complejoId,
                nroDia
            }
        }
    });
}

async function postHorario(horarioData: Horario, complejoId: number) {
    const nuevoHorario = await prisma.horario.create({
        data: {
            complejoId: complejoId,
            nroDia: horarioData.nroDia,
            horaApertura: horarioData.horaApertura,
            horaCierre: horarioData.horaCierre
        }
    });

    return nuevoHorario;
}

async function putHorario(complejoId: number, nroDia: number, horarioData: Partial<Horario>) {
    try {
        const dataToUpdate: any = {};
        if (horarioData.horaApertura) {
            dataToUpdate.horaApertura = horarioData.horaApertura;
        }
        if (horarioData.horaCierre) {
            dataToUpdate.horaCierre = horarioData.horaCierre;
        }
        const horarioActualizado = await prisma.horario.update({
            where: {
                complejoId_nroDia: {
                    complejoId,
                    nroDia
                }
            },
            data: dataToUpdate
        });
        return horarioActualizado;
    } catch (error) {
        return null;
    }
}

async function deleteHorario(complejoId: number, nroDia: number): Promise<boolean> {
    try {
        await prisma.horario.delete({
            where: {
                complejoId_nroDia: {
                    complejoId,
                    nroDia
                }
            }
        });
        return true;
    } catch (error) {
        return false;
    }
}

export {
    getHorario,
    getHorarios,
    postHorario,
    putHorario,
    deleteHorario
}