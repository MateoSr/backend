import { precioSchema } from "./precio.schema.js";

const precios = [
  {
    "id_complejo": 1,
    "nro_cancha": 1,
    "fechaDesde": "2023-01-01",
    "precioBase": 5000,
    "precioAdicional": 250,
    "precioSeña": 1000
  },
  {
    "id_complejo": 1,
    "nro_cancha": 2,
    "fechaDesde": "2023-01-01",
    "precioBase": 6000,
    "precioAdicional": 300,
    "precioSeña": 1200
  },
  {
    "id_complejo": 2,
    "nro_cancha": 1,
    "fechaDesde": "2023-01-01",
    "precioBase": 7000,
    "precioAdicional": 350,
    "precioSeña": 1400
  }
]

async function getPrecio(id_complejo,nro_cancha,fechaDesde){
    const precio = precio.find(p.id_complejo === id_complejo && 
        p.nro_cancha === nro_cancha && 
        p.fechaDesde === fechaDesde);
    return precio || null
}

async function postPrecio(precio){
    
    //Zod me permite valdiar los tipos de datos segun el schema y que esten los obligatorios
    const datosValidados = precioSchema.parse(precio)
    const nuevoPrecio = {...datosValidados};

    // 4. Guardamos en el arreglo
    precio.push(nuevoPrecio);
    return nuevoPrecio
}
async function getAllPrecios() {
    return precios || null   
}

export {
    getPrecio,
    postPrecio,
    getAllPrecios
}