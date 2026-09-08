import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// Lee la URL de conexion desde tu archivo .env
const connectionString = process.env.DATABASE_URL;

// Crea el pool de conexiones de PostgreSQL
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

// Exporta la instancia lista para usar en toda la app
export const prisma = new PrismaClient({ adapter });