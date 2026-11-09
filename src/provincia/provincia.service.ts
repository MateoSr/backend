import { prisma } from "../shared/prisma.js";

export interface Provincia {
    id:number;
    nombre:string;
}

async function getProvincias():Promise<Provincia[]>{
    return await prisma.provincia.findMany()
};

async function getProvincia(id:number):Promise<Provincia | null>{
    const provincia = await prisma.provincia.findUnique({
        where:{id}
    })
    return provincia || null
}

export {
    getProvincias,
    getProvincia
}
