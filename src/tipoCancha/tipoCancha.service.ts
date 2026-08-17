export interface TipoCancha {
    id: number;
    deporte: string;
}

const tipoCanchas: TipoCancha[] = [
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

async function getTipoCanchaId(id:number): Promise<TipoCancha | null> {
    const tipoCancha = tipoCanchas.find(c => c.id == id);
    return tipoCancha || null
}

async function getAllTipoCanchas(): Promise<TipoCancha[]> {
    return tipoCanchas    
}

export{
    getTipoCanchaId,
    getAllTipoCanchas
}