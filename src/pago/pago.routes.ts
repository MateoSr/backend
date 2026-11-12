import { Router } from "express";
import { crearOrden, webhook, estadoOrden } from "./pago.controller.js";
import { autenticar } from "../middleware/autenticas.js";

const pagoRouter = Router();

pagoRouter.post("/crear-orden", autenticar, crearOrden);
pagoRouter.post("/webhook", webhook);
pagoRouter.get("/estado/:externalReference", autenticar, estadoOrden);

export default pagoRouter;
