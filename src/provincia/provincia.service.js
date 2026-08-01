const provincias = [
  {"id": 1, "nombre": "Buenos Aires"},
  {"id": 2, "nombre": "Ciudad Autónoma de Buenos Aires"},
  {"id": 3, "nombre": "Catamarca"},
  {"id": 4, "nombre": "Chaco"},
  {"id": 5, "nombre": "Chubut"},
  {"id": 6, "nombre": "Córdoba"},
  {"id": 7, "nombre": "Corrientes"},
  {"id": 8, "nombre": "Entre Ríos"},
  {"id": 9, "nombre": "Formosa"},
  {"id": 10, "nombre": "Jujuy"},
  {"id": 11, "nombre": "La Pampa"},
  {"id": 12, "nombre": "La Rioja"},
  {"id": 13, "nombre": "Mendoza"},
  {"id": 14, "nombre": "Misiones"},
  {"id": 15, "nombre": "Neuquén"},
  {"id": 16, "nombre": "Río Negro"},
  {"id": 17, "nombre": "Salta"},
  {"id": 18, "nombre": "San Juan"},
  {"id": 19, "nombre": "San Luis"},
  {"id": 20, "nombre": "Santa Cruz"},
  {"id": 21, "nombre": "Santa Fe"},
  {"id": 22, "nombre": "Santiago del Estero"},
  {"id": 23, "nombre": "Tierra del Fuego, Antártida e Islas del Atlántico Sur"},
  {"id": 24, "nombre": "Tucumán"}
]

async function getProvincias(){
    return provincias || null
};

async function getProvincia(id){
    const provincia = provincias.find(provincia => provincia.id === Number(id))
    return provincia || null
}

export {
    getProvincias,
    getProvincia
}
