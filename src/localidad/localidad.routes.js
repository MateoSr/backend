import {Router} from 'express';
import {obtenerLocalidad, obtenerLocalidades} from './localidad.controller.js';

const localidadRouter = Router();

localidadRouter.get('/', obtenerLocalidades);
localidadRouter.get('/:id', obtenerLocalidad);

export default localidadRouter;