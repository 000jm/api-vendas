import { container } from 'tsyringe'
import type { Request, Response } from 'express'
import CreateProductUseCase from '@/products/application/usecases/create/create-product.usecase'
import { createProductSchema } from '../schemas/product.schemas'
import { productDataValidation } from '@/products/infrastructure/validation/zod'

async function createProductController(req: Request, res: Response): Promise<Response> {

    const { name, price, quantity } = await productDataValidation(createProductSchema, req.body)

    const createProductUseCase: CreateProductUseCase.UseCase = container.resolve('CreateProductUseCase')

    const product = await createProductUseCase.execute({ name, price, quantity })

    return res.status(201).json(product)

}

export default createProductController
