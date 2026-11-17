import { container } from 'tsyringe'
import type { Request, Response } from 'express'
import SearchProductUseCase from '@/products/application/usecases/search/search-product.usecase'
import { searchProductSchema } from '../schemas/product.schemas'
import { productDataValidation } from '@/products/infrastructure/validation/zod'

async function searchProductController(req: Request, res: Response): Promise<Response> {

    const source = { ...(req.query as Record<string, unknown>), ...req.body }
    const { page, per_page, sort, sort_dir, filter } = await productDataValidation(searchProductSchema, source)

    const searchProductUseCase: SearchProductUseCase.UseCase = container.resolve('SearchProductUseCase')

    const result = await searchProductUseCase.execute({
        page,
        per_page,
        sort,
        sort_dir,
        filter
    })

    return res.status(200).json(result)

}

export default searchProductController
