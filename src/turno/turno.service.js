import { turnoSchema } from "./turno.schema.js";
const turnos = [
    {
    "id": 1,
    "id_cliente": "3",
    "id_tipo_turno": "1",
    "id_complejo": "1",
    "nro_cancha": "2",
    "horarioInicio": "",
    "horarioFin": "",
    "estado": "",
    "motivoCancelacion": "",
},
    {"id": 2,
    "id_cliente": "4",
    "id_tipo_turno": "2",
    "id_complejo": "1",
    "nro_cancha": "1",
    "horarioInicio": "",
    "horarioFin": "",
    "estado": "",
    "motivoCancelacion": "",
}
]
async function getTurnoId(id) {
    const turno = turnos.find(c => c.id == id);
    return turno || null
}

async function postTurno(turno){
    
    //Zod me permite valdiar los tipos de datos segun el schema y que esten los obligatorios
    const datosValidados = turnoSchema.parse(turno)
    const  nextId = proximoId(turnos)
    const nuevoTurno = {id: nextId,...datosValidados};

    // 4. Guardamos en el arreglo
    turnos.push(nuevoTurno);
    return nuevoTurno
}
async function getAllTurnos() {
    return turnos || null   
}

async function putTurno(id,turnoNuevo) {

    //convierte todos los campos en opcional pero valida que concuerden los tipos
    const datosValidados = turnoSchema.partial().parse(turnoNuevo)

    const index = turnos.findIndex(c => c.id === Number(id));
    if(index === -1){
        return null
    }
    turnos[index] = {...turnos[index], ...datosValidados,id: Number(id)};

    const turnoCambiado = turnos[index]
    return turnoCambiado
}

async function deleteTurno(id) {
    const index = turnos.findIndex(c => c.id === Number(id));
    if(index === -1){
        return false
    }
    turnos.splice(index,1)
    return true
}

export {
    getTurnoId,
    postTurno,
    getAllTurnos,
    putTurno,
    deleteTurno
}