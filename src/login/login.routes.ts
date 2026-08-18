import { Router } from "express";
import {iniciarSesion,registrar,olvidePassword} from './login.controller.js'


const loginRouter = Router()

loginRouter.post("/login",iniciarSesion)
loginRouter.post("/register",registrar)
loginRouter.post("/forgot",olvidePassword)


export default loginRouter