import prisma from "../config/db.js"

function getAllUsers() {
    const usuarios = [
    { id: 1, nombre: "Lucas", email: "lucas@example.com", activo: true },
    { id: 2, nombre: "Sofia", email: "sofia@example.com", activo: true },
    { id: 3, nombre: "Mateo", email: "mateo@example.com", activo: false }
    ];

    // const usuarios = await prisma.usuario.findMany()
    if(usuarios != null){
        return usuarios
    }
    else{
        return 0
    }
};


export default getAllUsers