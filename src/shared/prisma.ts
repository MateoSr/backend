import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";


//generador del prisma client

const connectionString = process.env.DATABASE_URL;

//crea instancia de postgress
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

//exporta el prismaClient
export const prisma = new PrismaClient({ adapter });