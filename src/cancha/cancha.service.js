import { canchaSchema } from "./cancha.schema.js";

const canchas = [
  {
    "nro": 1,
    "id_tipo_cancha": 1,
    "id_complejo": 1,
  },
  {
    "nro": 2,
    "id_tipo_cancha": 1,
    "id_complejo": 1,
  },
  {
    "nro": 3,
    "id_tipo_cancha": 2,
    "id_complejo": 1,  
  },
  {
    "nro": 1,
    "id_tipo_cancha": 4,
    "id_complejo": 2,  }
]

async function getCanchaNro(nro,id_complejo) {
    const cancha = canchas.find(c => 
      c.nro == nro 
      && c.id_complejo == id_complejo);
    return cancha || null
}

async function postCancha(cancha,id_complejo){
    
    //Zod me permite valdiar los tipos de datos segun el schema y que esten los obligatorios
    const datosValidados = canchaSchema.parse(cancha)
    const nuevaCancha = {...datosValidados, id_complejo: id_complejo};

    // 4. Guardamos en el arreglo
    canchas.push(nuevaCancha);
    return nuevaCancha
}
async function getAllCanchas(id_complejo) {
    const canchasFiltradas = canchas.filter(c => c.id_complejo === id_complejo);
    return canchasFiltradas || null   
}

async function putCancha(nro,id_complejo,canchaNueva) {
    //convierte todos los campos en opcional pero valida que concuerden los tipos
    const datosValidados = canchaSchema.partial().parse(canchaNueva)

    const index = canchas.findIndex(c => c.id_complejo === id_complejo && c.nro === Number(nro));
    if(index === -1){
      return null
    }
    canchas[index] = {...canchas[index], ...datosValidados,nro: Number(nro), id_complejo: id_complejo};

    const canchaCambiado = canchas[index]
    return canchaCambiado
}

async function deleteCancha(nro,id_complejo) {
    const index = canchas.findIndex(c => c.id_complejo === id_complejo && c.nro === Number(nro));
    if(index === -1){
      return false
    }
    canchas.splice(index,1)
    return true
}

export {
    getCanchaNro,
    postCancha,
    getAllCanchas,
    putCancha,
    deleteCancha
}