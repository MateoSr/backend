import { type PersonaFisica as PersonaFisicaPrisma } from '@prisma/client';
import { personaFisicaSchema, type PersonaFisica } from "./personaFisica.schema.js";
import {prisma} from '../shared/prisma.js'; 

async function getPersonaFisicaDni(dni: string): Promise<PersonaFisicaPrisma | null> {
    return await prisma.personaFisica.findUnique({
        where: { dni }
    });
}

async function postPersonaFisica(personaFisica: PersonaFisica): Promise<PersonaFisicaPrisma> {
    const datosValidados = personaFisicaSchema.parse(personaFisica);

    const nuevaPersona = await prisma.personaFisica.create({
        data: datosValidados
    });

    return nuevaPersona;
}

async function getAllPersonasFisicas(): Promise<PersonaFisicaPrisma[]> {
    return await prisma.personaFisica.findMany();
}

async function putPersonaFisica(dni: string, personaFisicaNueva: Partial<PersonaFisica>): Promise<PersonaFisicaPrisma | null> {
    const datosValidados = personaFisicaSchema.partial().parse(personaFisicaNueva);

    try {
        const personaModificada = await prisma.personaFisica.update({
            where: { dni },
            data: datosValidados
        });
        
        return personaModificada;
    } catch (error: any) {
        if (error.code === 'P2025') {
            return null; // Retorna null si el DNI no existe en la base
        }
        throw error;
    }
}

async function deletePersonaFisica(dni: string): Promise<boolean> {
    try {
        await prisma.personaFisica.delete({
            where: { dni }
        });
        
        return true;
    } catch (error: any) {
        if (error.code === 'P2025') {
            return false; // Retorna false si el DNI no existe en la base
        }
        throw error;
    }
}

export {
    getPersonaFisicaDni,
    postPersonaFisica,
    getAllPersonasFisicas,
    putPersonaFisica,
    deletePersonaFisica
}