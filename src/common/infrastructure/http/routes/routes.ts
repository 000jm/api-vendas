
import productRouter from "@/products/infrastructure/http/routes/products.routes.ts"
import { authRouter } from "@/users/infrastructure/http/routes/auth.route"
import { passwordRouter } from "@/users/infrastructure/http/routes/password.route";
import { usersRoutes } from "@/users/infrastructure/http/routes/users.routes"
import { Router } from "express";
import { Request, Response } from "express";

const routes = Router()

routes.get('/', (req: Request, res: Response) => {
    res.status(200).json({ message: 'ola dev' })
})

routes.use('/products', productRouter)
routes.use('/products/:id', productRouter)

routes.use('/users', usersRoutes)
routes.use('/users/:id', usersRoutes)
routes.use('/auth', authRouter)
routes.use('/password', passwordRouter)

export default routes
