
import { Router } from "express"
import { authenticateUserController } from "../controllers/authenticate-user.controller.ts"

export const authRouter = Router()

authRouter.post('/login', authenticateUserController)
