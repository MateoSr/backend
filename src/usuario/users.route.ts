import { Router } from "express";
import { obtenerUser, obtenerUsers, obtenerClientes, crearUser, modificarUser, borrarUser, obtenerUserCompleto} from "./users.controller.js";
import { autenticar } from "../middleware/autenticas.js";
import { autorizarPorNombre } from "../middleware/autorizar.js";
import { validarCuerpo } from "../middleware/validar.js";
import { userSchema, userUpdateBodySchema } from "./users.schema.js";

const userRouter = Router()

userRouter.get('/perfil',autenticar,obtenerUserCompleto)

userRouter.get('/clientes',autenticar,autorizarPorNombre("Encargado"),obtenerClientes)

userRouter.put('/perfil',autenticar,validarCuerpo(userUpdateBodySchema),modificarUser)

userRouter.get('/',autenticar,autorizarPorNombre("Administrador"),obtenerUsers)

userRouter.get('/:id',autenticar,autorizarPorNombre("Administrador"),obtenerUser)

userRouter.post('/',autenticar,autorizarPorNombre("Administrador"),validarCuerpo(userSchema),crearUser)

userRouter.put('/:id',autenticar,autorizarPorNombre("Administrador"),validarCuerpo(userUpdateBodySchema),modificarUser)

userRouter.delete('/:id',autenticar,autorizarPorNombre("Administrador"),borrarUser)

export default userRouter
