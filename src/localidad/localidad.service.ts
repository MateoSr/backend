export interface Localidad{
    id:number;
    nombre:string;
    codigoPostal:string;
    id_provincia:number;
}

const localidades:Localidad[] = [
  {"id": 1, "nombre": "La Plata", "codigoPostal": "B1900", "id_provincia": 1},
  {"id": 2, "nombre": "Mar del Plata", "codigoPostal": "B7600", "id_provincia": 1},
  {"id": 3, "nombre": "Bahía Blanca", "codigoPostal": "B8000", "id_provincia": 1},
  {"id": 4, "nombre": "Tandil", "codigoPostal": "B7000", "id_provincia": 1},
  {"id": 5, "nombre": "San Nicolás de los Arroyos", "codigoPostal": "B2900", "id_provincia": 1},

  {"id": 6, "nombre": "Palermo", "codigoPostal": "C1425", "id_provincia": 2},
  {"id": 7, "nombre": "Belgrano", "codigoPostal": "C1428", "id_provincia": 2},
  {"id": 8, "nombre": "Caballito", "codigoPostal": "C1405", "id_provincia": 2},
  {"id": 9, "nombre": "San Telmo", "codigoPostal": "C1063", "id_provincia": 2},
  {"id": 10, "nombre": "Recoleta", "codigoPostal": "C1113", "id_provincia": 2},

  {"id": 11, "nombre": "San Fernando del Valle de Catamarca", "codigoPostal": "K4700", "id_provincia": 3},
  {"id": 12, "nombre": "Belén", "codigoPostal": "K4750", "id_provincia": 3},
  {"id": 13, "nombre": "Andalgalá", "codigoPostal": "K4740", "id_provincia": 3},
  {"id": 14, "nombre": "Tinogasta", "codigoPostal": "K5340", "id_provincia": 3},
  {"id": 15, "nombre": "Santa María", "codigoPostal": "K4139", "id_provincia": 3},

  {"id": 16, "nombre": "Resistencia", "codigoPostal": "H3500", "id_provincia": 4},
  {"id": 17, "nombre": "Presidencia Roque Sáenz Peña", "codigoPostal": "H3700", "id_provincia": 4},
  {"id": 18, "nombre": "Villa Ángela", "codigoPostal": "H3540", "id_provincia": 4},
  {"id": 19, "nombre": "General Pinedo", "codigoPostal": "H3732", "id_provincia": 4},
  {"id": 20, "nombre": "Charata", "codigoPostal": "H3730", "id_provincia": 4},

  {"id": 21, "nombre": "Rawson", "codigoPostal": "U9103", "id_provincia": 5},
  {"id": 22, "nombre": "Puerto Madryn", "codigoPostal": "U9120", "id_provincia": 5},
  {"id": 23, "nombre": "Trelew", "codigoPostal": "U9100", "id_provincia": 5},
  {"id": 24, "nombre": "Comodoro Rivadavia", "codigoPostal": "U9000", "id_provincia": 5},
  {"id": 25, "nombre": "Esquel", "codigoPostal": "U9200", "id_provincia": 5},

  {"id": 26, "nombre": "Córdoba Capital", "codigoPostal": "X5000", "id_provincia": 6},
  {"id": 27, "nombre": "Villa Carlos Paz", "codigoPostal": "X5152", "id_provincia": 6},
  {"id": 28, "nombre": "Río Cuarto", "codigoPostal": "X5800", "id_provincia": 6},
  {"id": 29, "nombre": "Villa María", "codigoPostal": "X5900", "id_provincia": 6},
  {"id": 30, "nombre": "San Francisco", "codigoPostal": "X2400", "id_provincia": 6},

  {"id": 31, "nombre": "Corrientes Capital", "codigoPostal": "W3400", "id_provincia": 7},
  {"id": 32, "nombre": "Goya", "codigoPostal": "W3450", "id_provincia": 7},
  {"id": 33, "nombre": "Paso de los Libres", "codigoPostal": "W3230", "id_provincia": 7},
  {"id": 34, "nombre": "Curuzú Cuatiá", "codigoPostal": "W3460", "id_provincia": 7},
  {"id": 35, "nombre": "Mercedes", "codigoPostal": "W3470", "id_provincia": 7},

  {"id": 36, "nombre": "Paraná", "codigoPostal": "E3100", "id_provincia": 8},
  {"id": 37, "nombre": "Concordia", "codigoPostal": "E3200", "id_provincia": 8},
  {"id": 38, "nombre": "Gualeguaychú", "codigoPostal": "E2820", "id_provincia": 8},
  {"id": 39, "nombre": "Concepción del Uruguay", "codigoPostal": "E3260", "id_provincia": 8},
  {"id": 40, "nombre": "Victoria", "codigoPostal": "E3153", "id_provincia": 8},

  {"id": 41, "nombre": "Formosa Capital", "codigoPostal": "P3600", "id_provincia": 9},
  {"id": 42, "nombre": "Clorinda", "codigoPostal": "P3610", "id_provincia": 9},
  {"id": 43, "nombre": "Pirané", "codigoPostal": "P3606", "id_provincia": 9},
  {"id": 44, "nombre": "El Colorado", "codigoPostal": "P3603", "id_provincia": 9},
  {"id": 45, "nombre": "Las Lomitas", "codigoPostal": "P3630", "id_provincia": 9},

  {"id": 46, "nombre": "San Salvador de Jujuy", "codigoPostal": "Y4600", "id_provincia": 10},
  {"id": 47, "nombre": "San Pedro de Jujuy", "codigoPostal": "Y4500", "id_provincia": 10},
  {"id": 48, "nombre": "Tilcara", "codigoPostal": "Y4624", "id_provincia": 10},
  {"id": 49, "nombre": "Humahuaca", "codigoPostal": "Y4630", "id_provincia": 10},
  {"id": 50, "nombre": "La Quiaca", "codigoPostal": "Y4650", "id_provincia": 10},

  {"id": 51, "nombre": "Santa Rosa", "codigoPostal": "L6300", "id_provincia": 11},
  {"id": 52, "nombre": "General Pico", "codigoPostal": "L6360", "id_provincia": 11},
  {"id": 53, "nombre": "Toay", "codigoPostal": "L6303", "id_provincia": 11},
  {"id": 54, "nombre": "Realicó", "codigoPostal": "L6200", "id_provincia": 11},
  {"id": 55, "nombre": "General Acha", "codigoPostal": "L8200", "id_provincia": 11},

  {"id": 56, "nombre": "La Rioja Capital", "codigoPostal": "F5300", "id_provincia": 12},
  {"id": 57, "nombre": "Chilecito", "codigoPostal": "F5360", "id_provincia": 12},
  {"id": 58, "nombre": "Aimogasta", "codigoPostal": "F5310", "id_provincia": 12},
  {"id": 59, "nombre": "Chamical", "codigoPostal": "F5380", "id_provincia": 12},
  {"id": 60, "nombre": "Villa Unión", "codigoPostal": "F5350", "id_provincia": 12},

  {"id": 61, "nombre": "Mendoza Capital", "codigoPostal": "M5500", "id_provincia": 13},
  {"id": 62, "nombre": "San Rafael", "codigoPostal": "M5600", "id_provincia": 13},
  {"id": 63, "nombre": "Godoy Cruz", "codigoPostal": "M5501", "id_provincia": 13},
  {"id": 64, "nombre": "Maipú", "codigoPostal": "M5515", "id_provincia": 13},
  {"id": 65, "nombre": "Malargüe", "codigoPostal": "M5613", "id_provincia": 13},

  {"id": 66, "nombre": "Posadas", "codigoPostal": "N3300", "id_provincia": 14},
  {"id": 67, "nombre": "Puerto Iguazú", "codigoPostal": "N3370", "id_provincia": 14},
  {"id": 68, "nombre": "Oberá", "codigoPostal": "N3360", "id_provincia": 14},
  {"id": 69, "nombre": "Eldorado", "codigoPostal": "N3380", "id_provincia": 14},
  {"id": 70, "nombre": "Apostoles", "codigoPostal": "N3350", "id_provincia": 14},

  {"id": 71, "nombre": "Neuquén Capital", "codigoPostal": "Q8300", "id_provincia": 15},
  {"id": 72, "nombre": "San Martín de los Andes", "codigoPostal": "Q8370", "id_provincia": 15},
  {"id": 73, "nombre": "Villa La Angostura", "codigoPostal": "Q8407", "id_provincia": 15},
  {"id": 74, "nombre": "Zapala", "codigoPostal": "Q8340", "id_provincia": 15},
  {"id": 75, "nombre": "Cutral Có", "codigoPostal": "Q8322", "id_provincia": 15},

  {"id": 76, "nombre": "Viedma", "codigoPostal": "R8500", "id_provincia": 16},
  {"id": 77, "nombre": "San Carlos de Bariloche", "codigoPostal": "R8400", "id_provincia": 16},
  {"id": 78, "nombre": "General Roca", "codigoPostal": "R8332", "id_provincia": 16},
  {"id": 79, "nombre": "Cipolletti", "codigoPostal": "R8324", "id_provincia": 16},
  {"id": 80, "nombre": "Las Grutas", "codigoPostal": "R8521", "id_provincia": 16},

  {"id": 81, "nombre": "Salta Capital", "codigoPostal": "A4400", "id_provincia": 17},
  {"id": 82, "nombre": "Cafayate", "codigoPostal": "A4427", "id_provincia": 17},
  {"id": 83, "nombre": "San Ramón de la Nueva Orán", "codigoPostal": "A4530", "id_provincia": 17},
  {"id": 84, "nombre": "Tartagal", "codigoPostal": "A4560", "id_provincia": 17},
  {"id": 85, "nombre": "General Güemes", "codigoPostal": "A4432", "id_provincia": 17},

  {"id": 86, "nombre": "San Juan Capital", "codigoPostal": "J5400", "id_provincia": 18},
  {"id": 87, "nombre": "Rawson", "codigoPostal": "J5425", "id_provincia": 18},
  {"id": 88, "nombre": "Chimbas", "codigoPostal": "J5413", "id_provincia": 18},
  {"id": 89, "nombre": "Caucete", "codigoPostal": "J5442", "id_provincia": 18},
  {"id": 90, "nombre": "Jáchal", "codigoPostal": "J5460", "id_provincia": 18},

  {"id": 91, "nombre": "San Luis Capital", "codigoPostal": "D5700", "id_provincia": 19},
  {"id": 92, "nombre": "Villa Mercedes", "codigoPostal": "D5730", "id_provincia": 19},
  {"id": 93, "nombre": "Merlo", "codigoPostal": "D5881", "id_provincia": 19},
  {"id": 94, "nombre": "La Punta", "codigoPostal": "D5703", "id_provincia": 19},
  {"id": 95, "nombre": "Justo Daract", "codigoPostal": "D5738", "id_provincia": 19},

  {"id": 96, "nombre": "Río Gallegos", "codigoPostal": "Z9400", "id_provincia": 20},
  {"id": 97, "nombre": "El Calafate", "codigoPostal": "Z9405", "id_provincia": 20},
  {"id": 98, "nombre": "Caleta Olivia", "codigoPostal": "Z9011", "id_provincia": 20},
  {"id": 99, "nombre": "Puerto Deseado", "codigoPostal": "Z9050", "id_provincia": 20},
  {"id": 100, "nombre": "El Chaltén", "codigoPostal": "Z9301", "id_provincia": 20},

  {"id": 101, "nombre": "Santa Fe Capital", "codigoPostal": "S3000", "id_provincia": 21},
  {"id": 102, "nombre": "Rosario", "codigoPostal": "S2000", "id_provincia": 21},
  {"id": 103, "nombre": "Rafaela", "codigoPostal": "S2300", "id_provincia": 21},
  {"id": 104, "nombre": "Venado Tuerto", "codigoPostal": "S2600", "id_provincia": 21},
  {"id": 105, "nombre": "Reconquista", "codigoPostal": "S3500", "id_provincia": 21},

  {"id": 106, "nombre": "Santiago del Estero Capital", "codigoPostal": "G4200", "id_provincia": 22},
  {"id": 107, "nombre": "La Banda", "codigoPostal": "G4200", "id_provincia": 22},
  {"id": 108, "nombre": "Termas de Río Hondo", "codigoPostal": "G4220", "id_provincia": 22},
  {"id": 109, "nombre": "Añatuya", "codigoPostal": "G3760", "id_provincia": 22},
  {"id": 110, "nombre": "Frías", "codigoPostal": "G4230", "id_provincia": 22},

  {"id": 111, "nombre": "Ushuaia", "codigoPostal": "V9410", "id_provincia": 23},
  {"id": 112, "nombre": "Río Grande", "codigoPostal": "V9420", "id_provincia": 23},
  {"id": 113, "nombre": "Tolhuin", "codigoPostal": "V9412", "id_provincia": 23},
  {"id": 114, "nombre": "Puerto Almanza", "codigoPostal": "V9410", "id_provincia": 23},
  {"id": 115, "nombre": "San Sebastián", "codigoPostal": "V9420", "id_provincia": 23},

  {"id": 116, "nombre": "San Miguel de Tucumán", "codigoPostal": "T4000", "id_provincia": 24},
  {"id": 117, "nombre": "Yerba Buena", "codigoPostal": "T4107", "id_provincia": 24},
  {"id": 118, "nombre": "Tafí del Valle", "codigoPostal": "T4137", "id_provincia": 24},
  {"id": 119, "nombre": "Concepción", "codigoPostal": "T4147", "id_provincia": 24},
  {"id": 120, "nombre": "Banda del Río Salí", "codigoPostal": "T4109", "id_provincia": 24}
]

async function getLocalidades():Promise<Localidad[]>{
    return localidades
};

async function getLocalidad(id:number):Promise<Localidad | null>{
    const localidad = localidades.find(localidad => localidad.id === id)
    return localidad || null
}
    
async function getLocalidadPorProvincia(id:number):Promise<Localidad[]|null>{
    const localidadesFiltro = localidades.filter(localidad => localidad.id_provincia === id)
    return localidadesFiltro || null
}

export {
    getLocalidades,
    getLocalidad,
    getLocalidadPorProvincia
}