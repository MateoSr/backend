import { Router } from "express";
import {iniciarSesion,registrar,olvidePassword,resetearPassword} from './auth.controller.js'


const loginRouter = Router()

loginRouter.post("/login",iniciarSesion)
loginRouter.post("/register",registrar)
loginRouter.post("/forgot",olvidePassword)
loginRouter.patch("/reset-password",resetearPassword)


export default loginRouter