import { Router } from "express";
import { obtenerUser, obtenerUsers, crearUser, modificarUser, borrarUser, obtenerUserCompleto} from "./users.controller.js";
import { autenticar } from "../middleware/autenticas.js";

const userRouter = Router()


userRouter.get('/perfil',autenticar,obtenerUserCompleto)
userRouter.put('/perfil',autenticar,modificarUser)

userRouter.get('/',obtenerUsers)
userRouter.get('/:id',obtenerUser)
userRouter.post('/',crearUser)
userRouter.put('/:id',modificarUser)
userRouter.delete('/:id',borrarUser)




export default userRouter