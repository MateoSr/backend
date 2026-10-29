import { Router } from "express";
import { obtenerUser, obtenerUsers, obtenerClientes, crearUser, modificarUser, borrarUser, obtenerUserCompleto} from "./users.controller.js";
import { autenticar } from "../middleware/autenticas.js";
import { autorizarPorNombre } from "../middleware/autorizar.js";

const userRouter = Router()


userRouter.get('/perfil',autenticar,obtenerUserCompleto)
userRouter.get('/clientes',autenticar,autorizarPorNombre("Encargado"),obtenerClientes)
userRouter.put('/perfil',autenticar,modificarUser)

userRouter.get('/',autenticar,autorizarPorNombre("Administrador"),obtenerUsers)
userRouter.get('/:id',autenticar,autorizarPorNombre("Administrador"),obtenerUser)
userRouter.post('/',autenticar,autorizarPorNombre("Administrador"),crearUser)
userRouter.put('/:id',autenticar,autorizarPorNombre("Administrador"),modificarUser)
userRouter.delete('/:id',autenticar,autorizarPorNombre("Administrador"),borrarUser)




export default userRouter