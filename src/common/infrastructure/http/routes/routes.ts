
import productRouter from "@/products/infrastructure/http/routes/products.routes.ts";
import { Router } from "express";
import { Request, Response } from "express";

const routes = Router()

routes.get('/', (req: Request, res: Response) => {
    res.status(200).json({ message: 'ola dev' })
})

routes.use('/products', productRouter)

export default routes
