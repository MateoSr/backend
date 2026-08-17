import { canchaSchema , type Cancha} from "./cancha.schema.js";

const canchas: Cancha[] = [
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

async function getCanchaNro(nro: number, id_complejo: number): Promise<Cancha | null> {
    const cancha = canchas.find(c => 
      c.nro === nro 
      && c.id_complejo === id_complejo);
    return cancha || null
}

async function postCancha(cancha: Omit<Cancha, 'id_complejo'>, id_complejo: number): Promise<Cancha> {
    
    //Zod me permite valdiar los tipos de datos segun el schema y que esten los obligatorios
    const datosValidados = canchaSchema.parse(cancha)
    const nuevaCancha = {...datosValidados, id_complejo: id_complejo};

    // 4. Guardamos en el arreglo
    canchas.push(nuevaCancha);
    return nuevaCancha
}
async function getAllCanchas(id_complejo: number): Promise<Cancha[]> {
    const canchasFiltradas = canchas.filter(c => c.id_complejo === id_complejo);
    return canchasFiltradas    
}

async function putCancha(nro: number, id_complejo: number, canchaNueva: Partial<Cancha>): Promise<Cancha | null> {
    //convierte todos los campos en opcional pero valida que concuerden los tipos
    const datosValidados = canchaSchema.partial().parse(canchaNueva)

    const index = canchas.findIndex(c => c.id_complejo === id_complejo && c.nro === nro);
    if(index === -1){
      return null
    }
    canchas[index] = {...canchas[index], ...datosValidados,nro: nro, id_complejo: id_complejo};

    const canchaCambiado = canchas[index]
    return canchaCambiado
}

async function deleteCancha(nro: number, id_complejo: number): Promise<boolean> {
    const index = canchas.findIndex(c => c.id_complejo === id_complejo && c.nro === nro);
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