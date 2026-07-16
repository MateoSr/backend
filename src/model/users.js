import prisma from "../config/db.js"

async function getAllUsers() {
    const usuarios = await prisma.usuario.findMany()
    if(usuarios != null){
        return usuarios
    }
    else{
        return 0
    }
};

export default getAllUsers