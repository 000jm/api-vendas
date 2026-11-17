import productRouter from '@/products/infrastructure/http/routes/products.routes'
import { authRouter } from '@/users/infrastructure/http/routes/auth.route'
import { passwordRouter } from '@/users/infrastructure/http/routes/password.route'
import { usersRoutes } from '@/users/infrastructure/http/routes/users.routes'
import { Router } from 'express'

const routes = Router()

routes.get('/', (_req, res) => {
    res.status(200).json({ status: 'ok' })
})

routes.use('/products', productRouter)
routes.use('/users', usersRoutes)
routes.use('/auth', authRouter)
routes.use('/password', passwordRouter)

export default routes
