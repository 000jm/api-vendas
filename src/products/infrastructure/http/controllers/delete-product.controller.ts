import { container } from 'tsyringe'
import type { Request, Response } from 'express'
import DeleteProductUseCase from '@/products/application/usecases/delete/delete-product.usecase'
import { deleteProductSchema } from '../schemas/product.schemas'
import { productDataValidation } from '@/products/infrastructure/validation/zod'

async function deleteProductController(req: Request, res: Response): Promise<Response> {

    const { id } = await productDataValidation(deleteProductSchema, req.params)

    const deleteProductUseCase: DeleteProductUseCase.UseCase = container.resolve('DeleteProductUseCase')

    await deleteProductUseCase.execute({ id })

    return res.status(204).send()

}

export default deleteProductController
