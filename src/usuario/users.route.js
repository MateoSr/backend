import { Router } from "express";
import getUsers from "./users.controller.js";
const userRouter = Router()

userRouter.get('/',getUsers)

export default userRouter