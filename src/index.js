import express from "express";
import prisma from "../src/config/db.js";
import userRouter from './router/user.js'


const app = express();

async function testConexion() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("Prisma se conectó a PostgreSQL ");
  } catch (error) {
    console.error("Error al conectar con la base de datos:");
  }
}

app.use(express.json());
app.use("/api/users",userRouter)

app.get("/", (req, res) => {
  res.send("Hello, World!");
})  

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
    console.log("http://localhost:3000");
    testConexion();
})