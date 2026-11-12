import {Router} from 'express';
import {obtenerProvincias, obtenerProvincia,obtenerLocalidadPorProvincia} from './provincia.controller.js';

const provinciaRouter = Router();

provinciaRouter.get('/', obtenerProvincias);
provinciaRouter.get('/:id', obtenerProvincia);
provinciaRouter.get('/:id/localidades', obtenerLocalidadPorProvincia);


export default provinciaRouter;