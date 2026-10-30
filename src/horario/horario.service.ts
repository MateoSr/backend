import { prisma } from '../shared/prisma.js'
import { horarioSchema } from './horario.schema.js'

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

async function postHorario(horarioData: unknown, complejoId: number) {
    const horarioValido = horarioSchema.parse(horarioData);
    const nuevoHorario = await prisma.horario.create({
        data: {
            complejoId: complejoId,
            nroDia: horarioValido.nroDia,
            horaApertura: horarioValido.horaApertura,
            horaCierre: horarioValido.horaCierre
        }
    });

    return nuevoHorario;
}

async function putHorario(complejoId: number, nroDia: number, horarioData: unknown) {
    const horarioValido = horarioSchema.partial().parse(horarioData);
    try {
        const dataToUpdate: any = {};
        if (horarioValido.horaApertura) {
            dataToUpdate.horaApertura = horarioValido.horaApertura;
        }
        if (horarioValido.horaCierre) {
            dataToUpdate.horaCierre = horarioValido.horaCierre;
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