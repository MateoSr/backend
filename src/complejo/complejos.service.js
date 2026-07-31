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
    //aplicar reglas de negocio
    if (!complejo.nombre || !complejo.direccion) {
        const error = new Error("El nombre y la direccion son campos obligatorios");
        throw error
    }
    complejos.push(complejo)
}
async function getAllComplejos(params) {
    
}

async function putComplejo(params) {
    
}

async function deleteComplejos(params) {
    
}

export {
    getComplejoId,
    postComplejo
}