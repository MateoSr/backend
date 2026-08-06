import { horarioSchema } from "./horario.schema.js"

const horarios =[
  {
    "id_complejo": 1,
    "num_dia": 1,
    "horarioApertura": "08:00",
    "horarioCierre": "23:00"
  },
  {
    "id_complejo": 1,
    "num_dia": 2,
    "horarioApertura": "08:00",
    "horarioCierre": "23:00"
  },
  {
    "id_complejo": 1,
    "num_dia": 3,
    "horarioApertura": "08:00",
    "horarioCierre": "23:00"
  },
  {
    "id_complejo": 1,
    "num_dia": 4,
    "horarioApertura": "08:00",
    "horarioCierre": "23:00"
  },
  {
    "id_complejo": 1,
    "num_dia": 5,
    "horarioApertura": "08:00",
    "horarioCierre": "00:00"
  },
  {
    "id_complejo": 1,
    "num_dia": 6,
    "horarioApertura": "09:00",
    "horarioCierre": "01:00"
  },
  {
    "id_complejo": 1,
    "num_dia": 7,
    "horarioApertura": "10:00",
    "horarioCierre": "21:00"
  },
  {
    "id_complejo": 1,
    "num_dia": 8,
    "horarioApertura": "14:00",
    "horarioCierre": "22:00"
  },
  {
    "id_complejo": 2,
    "num_dia": 1,
    "horarioApertura": "09:00",
    "horarioCierre": "22:00"
  },
  {
    "id_complejo": 2,
    "num_dia": 5,
    "horarioApertura": "09:00",
    "horarioCierre": "23:30"
  },
  {
    "id_complejo": 2,
    "num_dia": 6,
    "horarioApertura": "08:00",
    "horarioCierre": "02:00"
  },
  {
    "id_complejo": 2,
    "num_dia": 8,
    "horarioApertura": "11:00",
    "horarioCierre": "19:00"
  },
  {
    "id_complejo": 3,
    "num_dia": 1,
    "horarioApertura": "07:00",
    "horarioCierre": "23:00"
  },
  {
    "id_complejo": 3,
    "num_dia": 7,
    "horarioApertura": "09:00",
    "horarioCierre": "22:00"
  },
  {
    "id_complejo": 3,
    "num_dia": 8,
    "horarioApertura": "09:00",
    "horarioCierre": "18:00"
  }
]


async function getHorarios(id_complejo) {

    const horariosBuscados = horarios.filter(h => h.id_complejo === Number(id_complejo))
    return horariosBuscados || null
}

async function getHorario(id_complejo,num_dia) {
    const horario = horarios.filter(h => h.id_complejo === Number(id_complejo) && h.num_dia == Number(num_dia))
    return horario || null

    
}

async function postHorario(horario) {
    const horarioValido = horarioSchema.parse(horario)
    horarios.push(horario)
    return true
    
}

async function putHorario(id_complejo,num_dia,horario) {
    const horarioValido = horarioSchema.partial().parse(horario)

    const index = horarios.findIndex(h => h.id_complejo === Number(id_complejo) && h.num_dia === Number(num_dia));
    if(index === -1){
      return null
    }
    horarios[index] = {
    ...horarios[index],
    ...horario,
    id_complejo: Number(id_complejo), //modifica menos la clave primaria
    num_dia: Number(num_dia) // 
  };

    const horarioCambiado = horarios[index]
    return horarioCambiado
}

async function deleteHorario(id_complejo,num_dia) {
    const index = horarios.findIndex(h => h.id_complejo === Number(id_complejo) && h.num_dia === Number(num_dia));
    if (index === -1) {
        
        return false;
    }
    horarios.splice(index, 1);
    return true;
    
}

export {
    getHorario,
    getHorarios,
    postHorario,
    putHorario,
    deleteHorario
}