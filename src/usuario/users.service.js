import { userSchema } from "./users.schema.js";
import { proximoId } from "../shared/funciones.js";

const users = [
  {
    "id":1,
    "email": "lucas@example.com",
    "telefono": "3415123456",
    "password": "Password123!",
    "id_tipoUsuario": 1,
    "dni": "12345678",
  },
  {
    "id":2,
    "email": "sofia@example.com",
    "telefono": "3471456789",
    "password": "MiClaveSegura2026",
    "id_tipoUsuario": 2,
    "dni": "87654321"
  },
  {
    "id":3,
    "email": "mateo@example.com",
    "telefono": "3413987654",
    "password": "SuperSecretPass8",
    "id_tipoUsuario": 3,
    "cuit": "89023190812"
  }
]

async function getUserId(id) {
    const user = users.find(user => user.id == id);
    return user || null
}


//funcion que busca a un usuario por si email, para ver si esta usado ese email
// el parametroDev, indica si devuelve todo el objeto o solo si existe o no
async function getUserEmail(email,parametroDev = 1) {
  const user = users.find(user => user.email == email);
    if(parametroDev == 0){
      if(!user){
        return null
      }
      return user
    }
    else{
      if(!user){
        return false
      }
      return true
    }
}

async function validarUser(email,pass){
  const user = await getUserEmail(email,0)
  if(user){
    if(user.password == pass){
      return true
    }
    return false
  }

}

async function postUser(user){
    
    //Zod me permite valdiar los tipos de datos segun el schema y que esten los obligatorios
    const datosValidados = userSchema.parse(user)
    const  nextId = proximoId(users)
    const nuevoUsuario = {id: nextId,...datosValidados};
    users.push(nuevoUsuario)
    return nuevoUsuario
}

async function getAllUsers() {
    return users || null
}

async function putUser(id,userNuevo) {

    //convierte todos los campos en opcional pero valida que concuerden los tipos
    const datosValidados = userSchema.partial().parse(userNuevo)

    const index = users.findIndex(user => user.id === Number(id));
    if(index === -1){
      return null
    }
    users[index] = {...users[index], ...datosValidados,id: Number(id)};

    const userCambiado = users[index]
    return userCambiado
}

async function deleteUser(id) {
    const index = users.findIndex(user => user.id === Number(id));
    if(index === -1){
      return false
    }
    users.splice(index,1)
    return true
}

export {
    getUserId,
    postUser,
    getAllUsers,
    putUser,
    deleteUser,
    validarUser,
    getUserEmail
}