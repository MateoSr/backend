import { personaJuridicaSchema, type PersonaJuridica } from "./personaJuridica.schema.js";

const personasJuridicas: PersonaJuridica[] = [
  {cuit: "89023190812", razonSocial: "BuenosAmigos"},
  {cuit: "89054367845", razonSocial: "ViejosAmigos"},
  {cuit: "54687956756", razonSocial: "NuevosAmigos"}
];

async function getPersonaJuridicaCuit(cuit: string):Promise<PersonaJuridica|null> {
    const personaJuridica = personasJuridicas.find(personaJuridica => personaJuridica.cuit === cuit);
    return personaJuridica || null
}

async function postPersonaJuridica(personaJuridica: PersonaJuridica):Promise<PersonaJuridica> {
    const datosValidados = personaJuridicaSchema.parse(personaJuridica)
    personasJuridicas.push(datosValidados)
    return datosValidados
}

async function getAllPersonasJuridicas():Promise<PersonaJuridica[]|null> {
    return personasJuridicas || null
}

async function putPersonaJuridica(cuit: string, personaJuridicaNueva: Partial<PersonaJuridica>):Promise<PersonaJuridica|null> {
    const datosValidados = personaJuridicaSchema.partial().parse(personaJuridicaNueva)

    const index = personasJuridicas.findIndex(personaJuridica => personaJuridica.cuit === cuit);
    if(index === -1){
      return null
    }
    personasJuridicas[index] = {...personasJuridicas[index], ...datosValidados,cuit: cuit};

    const personaJuridicaCambiada = personasJuridicas[index]
    return personaJuridicaCambiada
}

async function deletePersonaJuridica(cuit: string):Promise<boolean> {
    const index = personasJuridicas.findIndex(personaJuridica => personaJuridica.cuit === cuit);
    if(index === -1){
      return false
    }
    personasJuridicas.splice(index,1)
    return true
}

export {
  getPersonaJuridicaCuit,
  postPersonaJuridica,
  getAllPersonasJuridicas,
  putPersonaJuridica,
  deletePersonaJuridica
}