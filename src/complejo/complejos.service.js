import { complejoSchema } from "./complejos.schema.js";

const complejos = [
  {
    "id": 1,
    "nombre": "Complejo Deportivo El Galpón",
    "direccion": "Av. San Martín 1420",
    "id_encargado": 101,
    "id_dueño": 1,
    "id_localidad": 2000
  },
  {
    "id": 2,
    "nombre": "Padel & Fútbol La Redonda",
    "direccion": "Calle 18 N° 850",
    "id_encargado": 102,
    "id_dueño": 2,
    "id_localidad": 2505
  },
  {
    "id": 3,
    "nombre": "Predio Deportivo Central",
    "direccion": "Bulevar Pellegrini 310",
    "id_encargado": 103,
    "id_dueño": 1,
    "id_localidad": 3000
  },
  {
    "id": 4,
    "nombre": "Canchas Sintéticas El Roble",
    "direccion": "Ruta 178 Km 12",
    "id_encargado": 104,
    "id_dueño": 3,
    "id_localidad": 2520
  }
]

async function getComplejoId(id) {
    const complejo = complejos.find(c => c.id == id);
    return complejo || null
}

async function postComplejo(complejo){
    
    //Zod me permite valdiar los tipos de datos segun el schema y que esten los obligatorios
    const datosValidados = complejoSchema.parse(complejo)
    complejos.push(complejo)
    return true
}
async function getAllComplejos() {
    return complejos || null   
}

async function putComplejo(id,complejoNuevo) {

    //convierte todos los campos en opcional pero valida que concuerden los tipos
    const datosValidados = complejoSchema.partial().parse(complejoNuevo)

    const index = complejos.findIndex(c => c.id === Number(id));
    if(index === -1){
      return null
    }
    complejos[index] = {...complejos[index], ...complejoNuevo,id: Number(id)};

    const complejoCambiado = complejos[index]
    return complejoCambiado
}

async function deleteComplejo(id) {
    const index = complejos.findIndex(c => c.id === Number(id));
    if(index === -1){
      return false
    }
    complejos.splice(index,1)
    return true
}

export {
    getComplejoId,
    postComplejo,
    getAllComplejos,
    putComplejo,
    deleteComplejo
}