import express from "express";
import prisma from "../src/config/db.js";
import userRouter from './usuario/users.route.js'
import complejoRouter from  './complejo/complejos.routes.js'
import provinciaRouter from './provincia/provincia.routes.js'
import localidadRouter from "./localidad/localidad.routes.js";
import tipoUsuarioRouter from "./tipoUsuario/tipoUsuario.routes.js";
import personaJuridicaRouter from "./personaJuridica/personaJuridica.routes.js";
import personaFisicaRouter from "./personaFisica/personaFisica.routes.js";


const app = express();

// async function testConexion() {
//   try {
//     await prisma.$queryRaw`SELECT 1`;
//     console.log("Prisma se conectó a PostgreSQL ");
//   } catch (error) {
//     console.error("Error al conectar con la base de datos:");
//   }
// }

app.use(express.json());
app.use("/api/users",userRouter)
app.use("/api/complejos",complejoRouter)
app.use("/api/provincias",provinciaRouter)
app.use("/api/localidad",localidadRouter)
app.use("/api/tipoUsuario",tipoUsuarioRouter)
app.use("/api/personaJuridica",personaJuridicaRouter)
app.use("/api/personaFisica",personaFisicaRouter)


app.get("/", (req, res) => {
  res.send("Hello, World!");
})  

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
    console.log("http://localhost:3000");
    // testConexion();
})