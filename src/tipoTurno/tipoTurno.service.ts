export interface TipoTurno {
    id: number;
    nombre: string;
    descripcion: string;
}

const tipoTurnos: TipoTurno[] = [
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

async function getTipoTurnoId(id:number): Promise<TipoTurno | null> {
    const tipoTurno = tipoTurnos.find(c => c.id == id);
    return tipoTurno || null
}

async function getAllTipoTurnos(): Promise<TipoTurno[]> {
    return tipoTurnos   
}

export{
    getTipoTurnoId,
    getAllTipoTurnos
}