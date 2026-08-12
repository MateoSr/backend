import { Router } from "express";
import { obtenerUser, obtenerUsers, crearUser, modificarUser, borrarUser, modificarUserCompleto, obtenerUserCompleto} from "./users.controller.js";

const userRouter = Router()

userRouter.get('/',obtenerUsers)
userRouter.get('/:id',obtenerUser)
userRouter.post('/',crearUser)
userRouter.put('/:id',modificarUser)
userRouter.delete('/:id',borrarUser)

userRouter.get('/:id/perfil',obtenerUserCompleto)
userRouter.put('/:id/perfil',modificarUserCompleto)


export default userRouter