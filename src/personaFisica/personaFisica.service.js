import { personaFisicaSchema } from "./personaFisica.schema.js";

const personasFisicas = [
  {nombre: "Lucas", apellido: "Perez", dni: "12345678", fechaNacimiento: "2000-01-01"},
  {nombre: "Sofia", apellido: "Garcia", dni: "87654321", fechaNacimiento: "2000-01-01"},
  {nombre: "Mateo", apellido: "Martinez", dni: "33444555", fechaNacimiento: "2000-01-01"}
];

async function getPersonaFisicaDni(dni) {
    const personaFisica = personasFisicas.find(personaFisica => personaFisica.dni == dni);
    return personaFisica || null
}

async function postPersonaFisica(personaFisica){
    const datosValidados = personaFisicaSchema.parse(personaFisica)
    personasFisicas.push(datosValidados)
    return true
}

async function getAllPersonasFisicas() {
    return personasFisicas || null
}

async function putPersonaFisica(dni,personaFisicaNueva) {
    const datosValidados = personaFisicaSchema.partial().parse(personaFisicaNueva)

    const index = personasFisicas.findIndex(personaFisica => personaFisica.dni == dni);
    if(index === -1){
      return null
    }
    personasFisicas[index] = {...personasFisicas[index], ...datosValidados,dni: dni};

    const personaFisicaCambiada = personasFisicas[index]
    return personaFisicaCambiada
}

async function deletePersonaFisica(dni) {
    const index = personasFisicas.findIndex(personaFisica => personaFisica.dni ==dni);
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