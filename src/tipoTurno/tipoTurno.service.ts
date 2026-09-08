import { prisma } from '../shared/prisma.js'

async function getTipoTurnoId(id:number) {
    return await prisma.tipoTurno.findUnique({
        where: {
            id: id
        }
    })
}

async function getAllTipoTurnos() {
    return await prisma.tipoTurno.findMany();
}

export{
    getTipoTurnoId,
    getAllTipoTurnos
}