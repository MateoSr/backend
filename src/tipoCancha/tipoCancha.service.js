const tipoCanchas = [
    {
    "id": 1,
    "deporte": "Futbol 5"
},
    {
    "id": 2,
    "deporte": "Futbol 11"
},
    {
    "id": 3,
    "deporte": "Basquet"
},
    {
    "id": 4,
    "deporte": "Tenis"
}
]

async function getTipoCanchaId(id) {
    const tipoCancha = tipoCanchas.find(c => c.id == id);
    return tipoCancha || null
}

async function getAllTipoCanchas() {
    return tipoCanchas || null   
}

export{
    getTipoCanchaId,
    getAllTipoCanchas
}