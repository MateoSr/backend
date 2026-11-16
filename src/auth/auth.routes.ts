import { Router } from "express";
import {iniciarSesion,refrescarSesion,registrar,olvidePassword,resetearPassword} from './auth.controller.js'
import { validarCuerpo } from '../middleware/validar.js'
import { registroSchema } from './auth.schema.js'

const loginRouter = Router()

loginRouter.post("/login",iniciarSesion)

loginRouter.post("/refresh",refrescarSesion)

loginRouter.post("/register",validarCuerpo(registroSchema),registrar)

loginRouter.post("/forgot",olvidePassword)

loginRouter.patch("/reset-password",resetearPassword)

export default loginRouter
