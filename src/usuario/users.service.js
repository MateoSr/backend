import { userSchema } from "./users.schema.js";
import { proximoId } from "../shared/funciones.js";
import bcrypt from "bcryptjs";
import { error } from "node:console";

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
async function getUserEmail(email) {
  const user = users.find(user => user.email == email);
    if(!user){
      return null
    }
    return user
}

async function validarUser(email,pass){
  const user = await getUserEmail(email)
  console.log(user)
  if(user){
    const verificacion = await bcrypt.compare(pass,user.password)
    if(verificacion){
      return true
    }
    return false
  }

}

async function postUser(user){
    
    //Zod me permite valdiar los tipos de datos segun el schema y que esten los obligatorios
    if(await getUserEmail(user.email)){
      throw new Error("El email ya se encuentra registrado") 
    }
    const datosValidados = userSchema.parse(user)
    const  nextId = proximoId(users)
    const contraSegura = await bcrypt.hash(datosValidados.password,10)
    const nuevoUsuario = {id: nextId,...datosValidados,password:contraSegura};
    users.push(nuevoUsuario)
    return nuevoUsuario
}

async function getAllUsers() {
    return users || null
}

async function putUser(id,userNuevo) {

    //convierte todos los campos en opcional pero valida que concuerden los tipos
    const datosValidados = userSchema.partial().parse(userNuevo)
    if (datosValidados.password) {
      const passwordHasheada = await bcrypt.hash(datosValidados.password, 10);
      datosValidados.password = passwordHasheada;
    }


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