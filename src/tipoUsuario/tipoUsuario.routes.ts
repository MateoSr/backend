import {Router} from 'express';
import {obtenerTipoUsuario, obtenerTiposUsuario} from './tipoUsuario.controller.js';

const tipoUsuarioRouter = Router();

tipoUsuarioRouter.get('/', obtenerTiposUsuario);
tipoUsuarioRouter.get('/:id', obtenerTipoUsuario);

export default tipoUsuarioRouter;