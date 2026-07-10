import express from "express";
import prisma from "../src/config/db.js";

const app = express();

async function testConexion() {
  try {
    // Intentamos ejecutar una consulta cruda nativa en Postgres
    await prisma.$queryRaw`SELECT 1`;
    console.log("=========================================");
    console.log("🚀 ¡Prisma se conectó a PostgreSQL con éxito!");
    console.log("=========================================");
  } catch (error) {
    console.error("=========================================");
    console.error("❌ Error al conectar con la base de datos:");
    console.error(error.message);
    console.error("=========================================");
  }
}

// Ejecutamos la prueba
testConexion();

app.get("/", (req, res) => {
  res.send("Hello, World!");
})  

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
    console.log("http://localhost:3000");
})