import { container } from 'tsyringe'
import type { Request, Response } from 'express'
import UpdateProductUseCase from '@/products/application/usecases/update/update-product.usecase'
import type ProductModel from '@/products/domain/models/products.model'
import { updateProductIdSchema, updateProductSchema } from '../schemas/product.schemas'
import { productDataValidation } from '@/products/infrastructure/validation/zod'

async function updateProductController(req: Request, res: Response): Promise<Response> {

    const { id } = await productDataValidation(updateProductIdSchema, req.params)
    const { name, price, quantity } = await productDataValidation(updateProductSchema, req.body)

    const updateProductUseCase: UpdateProductUseCase.UseCase = container.resolve('UpdateProductUseCase')

    const input: ProductModel = {
        id,
        name,
        price,
        quantity,
    }

    const product = await updateProductUseCase.execute(input)

    return res.status(200).json(product)

}

export default updateProductController
