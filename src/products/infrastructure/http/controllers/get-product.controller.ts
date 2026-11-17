import { container } from 'tsyringe'
import type { Request, Response } from 'express'
import GetProductUseCase from '@/products/application/usecases/get/get-product.usecase'
import { getProductSchema } from '../schemas/product.schemas'
import { productDataValidation } from '@/products/infrastructure/validation/zod'

async function getProductController(req: Request, res: Response): Promise<Response> {

    const { id } = await productDataValidation(getProductSchema, req.params)

    const getProductUseCase: GetProductUseCase.UseCase = container.resolve('GetProductUseCase')

    const product = await getProductUseCase.execute({ id })

    return res.status(200).json(product)

}

export default getProductController
