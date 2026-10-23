import express from "express";
import userRouter from './usuario/users.route.js'
import complejoRouter from  './complejo/complejos.routes.js'
import provinciaRouter from './provincia/provincia.routes.js'
import localidadRouter from "./localidad/localidad.routes.js";
import tipoUsuarioRouter from "./tipoUsuario/tipoUsuario.routes.js";
import personaJuridicaRouter from "./personaJuridica/personaJuridica.routes.js";
import personaFisicaRouter from "./personaFisica/personaFisica.routes.js";
import turnoRouter from "./turno/turno.routes.js";
import tipoTurnoRouter from "./tipoTurno/tipoTurno.routes.js";
import tipoCanchaRouter from "./tipoCancha/tipoCancha.routes.js";
import loginRouter from "./auth/auth.routes.js";
import contactoRouter from "./contacto/contacto.routes.js";
import menuRouter from "./menues/menu.routes.js"
import pagoRouter from "./pago/pago.routes.js"
import cors, { type CorsOptions } from 'cors';
import morgan from "morgan";


const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_PUBLIC_URL,
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean) as string[]; // Remueve valores undefined/null

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Permitir solicitudes sin origen (como llamadas de Postman, tareas server-to-server o Mobile)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS bloqueado para el origen: ${origin}`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Útil para manejo de sesiones o cookies entre dominios
  optionsSuccessStatus: 200, // Compatibilidad con navegadores antiguos (legacy smart TVs/IE)
};


// Durante los tests no queremos los logs de cada petición
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan("dev")); //ver las peticiones que llegan al servidor
}
app.use(cors(corsOptions)); //todas las rutas con CORS, algo de seguridad
app.use(express.json()); //servidor recibe y envia json
app.use("/api/users",userRouter)
app.use("/api/complejos",complejoRouter)
app.use("/api/provincias",provinciaRouter)
app.use("/api/localidad",localidadRouter)
app.use("/api/tipoUsuario",tipoUsuarioRouter)
app.use("/api/personaJuridica",personaJuridicaRouter)
app.use("/api/personaFisica",personaFisicaRouter)
app.use("/api",loginRouter)
app.use("/api/turnos",turnoRouter)
app.use("/api/tipoTurno",tipoTurnoRouter)
app.use("/api/tipoCancha",tipoCanchaRouter)
app.use("/api/contacto",contactoRouter)
app.use("/api/menues",menuRouter)
app.use("/api/pagos",pagoRouter)

app.get("/", (req, res) => {
  res.send("Hello, World!");
})

export default app;
