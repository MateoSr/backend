import { Router } from "express";
import {iniciarSesion,registrar} from './login.controller.js'


const loginRouter = Router()

loginRouter.post("/login",iniciarSesion)
loginRouter.post("/register",registrar)


export default loginRouter