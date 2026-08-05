import { Router } from "express";
import iniciarSesion from './login.controller.js'


const loginRouter = Router()

loginRouter.post("/",iniciarSesion)

export default loginRouter