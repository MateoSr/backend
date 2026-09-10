import { Router } from "express";
import { obtenerUser, obtenerUsers, crearUser, modificarUser, borrarUser, modificarUserCompleto, obtenerUserCompleto} from "./users.controller.js";
import { autenticar } from "../middleware/autenticas.js";

const userRouter = Router()


userRouter.get('/perfil',autenticar,obtenerUserCompleto)
userRouter.put('/perfil',autenticar,modificarUserCompleto)

userRouter.get('/',obtenerUsers)
userRouter.get('/:id',obtenerUser)
userRouter.post('/',crearUser)
userRouter.put('/:id',modificarUser)
userRouter.delete('/:id',borrarUser)




export default userRouter