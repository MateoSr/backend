const tipoTurnos = [
    {
    "id": 1,
    "nombre": "Común",
    "descripcion": ""
},
    {
    "id": 2,
    "nombre": "Fijo",
    "descripcion": ""
},
    {
    "id": 3,
    "nombre": "Evento",
    "descripcion": ""
},
    {
    "id": 4,
    "nombre": "Torneo",
    "descripcion": ""
}
]

async function getTipoTurnoId(id) {
    const tipoTurno = tipoTurnos.find(c => c.id == id);
    return tipoTurno || null
}

async function getAllTipoTurnos() {
    return tipoTurnos || null   
}

export{
    getTipoTurnoId,
    getAllTipoTurnos
}