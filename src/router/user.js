import { Router } from "express";
import getUsers from "../controlers/user.js";
const userRouter = Router()

userRouter.get('/',getUsers)

export default userRouter