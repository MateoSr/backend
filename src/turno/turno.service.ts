import { turnoSchema, type Turno } from "./turno.schema.js";
import { proximoId } from "../shared/funciones.js";

export interface TurnoSalida extends Turno {
    id: number;
}

export interface FiltrosTurno {
  id_cliente?: number;
}

const turnos:TurnoSalida[] = [ 
  {"id": 1, "id_cliente": 1, "id_tipo_turno": 1, "id_complejo": 10, "nro_cancha": 1,"fecha":"2000-01-01", "horarioInicio": "18:00", "horarioFin": "19:30", "estado": "reservado"},
  {"id": 2, "id_cliente": 1, "id_tipo_turno": 1, "id_complejo": 10, "nro_cancha": 2,"fecha":"2000-01-01", "horarioInicio": "19:30", "horarioFin": "21:00", "estado": "reservado"},
  {"id": 3, "id_cliente": 1, "id_tipo_turno": 2, "id_complejo": 12, "nro_cancha": 3,"fecha":"2000-01-01", "horarioInicio": "21:00", "horarioFin": "22:30", "estado": "completado"},
  {"id": 4, "id_cliente": 2, "id_tipo_turno": 1, "id_complejo": 10, "nro_cancha": 1,"fecha":"2000-01-01" ,"horarioInicio": "19:00", "horarioFin": "20:30", "estado": "reservado"},
  {"id": 5, "id_cliente": 2, "id_tipo_turno": 1, "id_complejo": 11, "nro_cancha": 1,"fecha":"2000-01-01" ,"horarioInicio": "20:00", "horarioFin": "21:30", "estado": "cancelado", "motivoCancelacion": "Lluvia intensa y filtraciones en cancha"},
  {"id": 6, "id_cliente": 3, "id_tipo_turno": 2, "id_complejo": 12, "nro_cancha": 2,"fecha":"2000-01-01" ,"horarioInicio": "17:00", "horarioFin": "18:30", "estado": "reservado"},
  {"id": 7, "id_cliente": 1, "id_tipo_turno": 1, "id_complejo": 11, "nro_cancha": 4,"fecha":"2000-01-01", "horarioInicio": "20:30", "horarioFin": "22:00", "estado": "reservado"},
  {"id": 8, "id_cliente": 4, "id_tipo_turno": 1, "id_complejo": 10, "nro_cancha": 1,"fecha":"2000-01-01", "horarioInicio": "18:30", "horarioFin": "20:00", "estado": "completado"},
  {"id": 9, "id_cliente": 2, "id_tipo_turno": 2, "id_complejo": 12, "nro_cancha": 1,"fecha":"2000-01-01", "horarioInicio": "22:00", "horarioFin": "23:30", "estado": "cancelado", "motivoCancelacion": "Aviso del cliente por motivos personales"},
  {"id": 10, "id_cliente": 3, "id_tipo_turno": 1, "id_complejo": 10, "nro_cancha": 3,"fecha":"2000-01-01", "horarioInicio": "19:00", "horarioFin": "20:30", "estado": "reservado"}

]
async function getTurnoId(id:number): Promise<TurnoSalida | null> {
    const turno = turnos.find(c => c.id === id);
    return turno || null
}

async function postTurno(turno:Turno): Promise<TurnoSalida> {
    
    //Zod me permite valdiar los tipos de datos segun el schema y que esten los obligatorios
    const datosValidados = turnoSchema.parse(turno)
    const  nextId = proximoId(turnos)
    const nuevoTurno:TurnoSalida = {id: nextId,...datosValidados};

    // 4. Guardamos en el arreglo
    turnos.push(nuevoTurno);
    return nuevoTurno
}

async function getAllTurnos(filtros: FiltrosTurno = {}):Promise<TurnoSalida[]> {
    const {id_cliente} = filtros
    if(id_cliente === undefined || isNaN(id_cliente)) {
        return turnos 
    }
    const turnosBuscados = turnos.filter(t => t.id_cliente === id_cliente)
    return turnosBuscados 
    
}

async function putTurno(id:number,turnoNuevo:Turno): Promise<TurnoSalida | null> {

    //convierte todos los campos en opcional pero valida que concuerden los tipos
    const datosValidados = turnoSchema.partial().parse(turnoNuevo)

    const index = turnos.findIndex(c => c.id === id);
    if(index === -1){
        return null
    }
    turnos[index] = {...turnos[index], ...datosValidados,id: id};

    const turnoCambiado = turnos[index]
    return turnoCambiado
}

async function deleteTurno(id:number): Promise<boolean> {
    const index = turnos.findIndex(c => c.id === id);
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