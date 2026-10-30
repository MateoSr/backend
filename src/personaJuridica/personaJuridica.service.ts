import { type PersonaJuridica as PersonaJuridicaPrisma } from '@prisma/client';
import { personaJuridicaSchema, type PersonaJuridica } from "./personaJuridica.schema.js";
import {prisma} from '../shared/prisma.js'; 

async function getPersonaJuridicaCuit(cuit: string): Promise<PersonaJuridicaPrisma | null> {
    return await prisma.personaJuridica.findUnique({
        where: { cuit }
    });
}

async function postPersonaJuridica(personaJuridica: PersonaJuridica): Promise<PersonaJuridicaPrisma> {
    const datosValidados = personaJuridicaSchema.parse(personaJuridica);

    const nuevaPersonaJuridica = await prisma.personaJuridica.create({
        data: datosValidados
    });

    return nuevaPersonaJuridica;
}

async function getAllPersonasJuridicas(): Promise<PersonaJuridicaPrisma[]> {
    return await prisma.personaJuridica.findMany();
}

async function putPersonaJuridica(cuit: string, personaJuridicaNueva: Partial<PersonaJuridica>): Promise<PersonaJuridicaPrisma | null> {
    const datosValidados = personaJuridicaSchema.partial().parse(personaJuridicaNueva);

    try {
        const personaJuridicaModificada = await prisma.personaJuridica.update({
            where: { cuit },
            data: datosValidados
        });
        
        return personaJuridicaModificada;
    } catch (error: any) {
        if (error.code === 'P2025') {
            return null;
        }
        throw error;
    }
}

async function deletePersonaJuridica(cuit: string): Promise<boolean> {
    try {
        await prisma.personaJuridica.delete({
            where: { cuit }
        });
        
        return true;
    } catch (error: any) {
        if (error.code === 'P2025') {
            return false;
        }
        throw error;
    }
}

export {
    getPersonaJuridicaCuit,
    postPersonaJuridica,
    getAllPersonasJuridicas,
    putPersonaJuridica,
    deletePersonaJuridica
}