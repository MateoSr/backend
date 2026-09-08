import { prisma } from '../shared/prisma.js'

async function getAllLocalidades() {
    return await prisma.localidad.findMany()
}

async function getLocalidad(id: number) {
    return await prisma.localidad.findUnique({
        where: { 
            id: id 
        }
    })
}
    
async function getLocalidadPorProvincia(provinciaId: number) {
    return await prisma.localidad.findMany({
        where: { 
            provincia: {
                id: provinciaId
            }
        }
    })
}

export {
    getAllLocalidades,
    getLocalidad,
    getLocalidadPorProvincia
}