import { complejoSchema,type Complejo } from "./complejos.schema.js";
import { proximoId } from "../shared/funciones.js";

export interface ComplejoSalida extends Complejo {
    id: number;
}

const complejos:ComplejoSalida[] = [
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

async function getComplejoId(id: number): Promise<ComplejoSalida|null> {
    const complejo = complejos.find(c => c.id === id);
    return complejo || null
}

async function postComplejo(complejo: Complejo): Promise<ComplejoSalida> {
    
    //Zod me permite valdiar los tipos de datos segun el schema y que esten los obligatorios
    const datosValidados = complejoSchema.parse(complejo)
    const  nextId = proximoId(complejos)
    const nuevoComplejo = {id: nextId,...datosValidados};

    // 4. Guardamos en el arreglo
    complejos.push(nuevoComplejo);
    return nuevoComplejo
}
async function getAllComplejos(): Promise<ComplejoSalida[]> {
    return complejos || null   
}

async function putComplejo(id: number, complejoNuevo: Partial<Complejo>): Promise<ComplejoSalida|null> {

    //convierte todos los campos en opcional pero valida que concuerden los tipos
    const datosValidados = complejoSchema.partial().parse(complejoNuevo)

    const index = complejos.findIndex(c => c.id ===id);
    if(index === -1){
      return null
    }
    complejos[index] = {...complejos[index], ...datosValidados,id:id};

    const complejoCambiado = complejos[index]
    return complejoCambiado
}

async function deleteComplejo(id: number) {
    const index = complejos.findIndex(c => c.id === id);
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