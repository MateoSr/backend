import { Router } from "express";
import { recibirSolicitud } from "./contacto.controller/contacto.controller.js";

const contactoRouter = Router();

contactoRouter.post("/", recibirSolicitud);

export default contactoRouter;