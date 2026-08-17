import { personaFisicaSchema,type PersonaFisica } from "./personaFisica.schema.js";

const personasFisicas: PersonaFisica[] = [
  {nombre: "Lucas", apellido: "Perez", dni: "12345678", fechaNacimiento: "2000-01-01"},
  {nombre: "Sofia", apellido: "Garcia", dni: "87654321", fechaNacimiento: "2000-01-01"},
  {nombre: "Mateo", apellido: "Martinez", dni: "33444555", fechaNacimiento: "2000-01-01"}
];

async function getPersonaFisicaDni(dni: string): Promise<PersonaFisica|null> {
    const personaFisica = personasFisicas.find(personaFisica => personaFisica.dni === dni);
    return personaFisica || null
}

async function postPersonaFisica(personaFisica: PersonaFisica): Promise<PersonaFisica> {
    const datosValidados = personaFisicaSchema.parse(personaFisica)
    personasFisicas.push(datosValidados)
    return datosValidados
}

async function getAllPersonasFisicas(): Promise<PersonaFisica[]|null> {
    return personasFisicas || null
}

async function putPersonaFisica(dni: string, personaFisicaNueva: Partial<PersonaFisica>): Promise<PersonaFisica|null> {
    const datosValidados = personaFisicaSchema.partial().parse(personaFisicaNueva)

    const index = personasFisicas.findIndex(personaFisica => personaFisica.dni ===  dni);
    if(index === -1){
      return null
    }
    personasFisicas[index] = {...personasFisicas[index], ...datosValidados,dni: dni};

    const personaFisicaCambiada = personasFisicas[index]
    return personaFisicaCambiada
}

async function deletePersonaFisica(dni: string): Promise<boolean> {
    const index = personasFisicas.findIndex(personaFisica => personaFisica.dni === dni);
    if(index === -1){
      return false
    }
    personasFisicas.splice(index,1)
    return true
}

export {
  getPersonaFisicaDni,
  postPersonaFisica,
  getAllPersonasFisicas,
  putPersonaFisica,
  deletePersonaFisica
}