import { userSchema } from "./users.schema.js";

const users = [
    { id: 1, email: "lucas@example.com", activo: true },
    { id: 2, email: "sofia@example.com", activo: true },
    { id: 3, email: "mateo@example.com", activo: false }
    ];

async function getUserId(id) {
    const user = users.find(user => user.id == id);
    return user || null
}

async function postUser(user){
    
    //Zod me permite valdiar los tipos de datos segun el schema y que esten los obligatorios
    const datosValidados = userSchema.parse(user)
    users.push(datosValidados)
    return true
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
    deleteUser
}