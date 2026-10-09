
import { Request, Response } from "express"
import '@/common/infrastructure/container'
import { container } from "tsyringe"
import SearchProductUseCase from "@/products/application/usecases/search/search-product.usecase"
import { searchProductSchema } from "../schemas/product.schemas"
import { productDataValidation } from "@/products/infrastructure/validation/zod"

async function searchProductController(req: Request, res: Response): Promise<Response> {

    const validData = await productDataValidation(searchProductSchema, req.body)
    const { page, per_page, sort, sort_dir, filter } = validData

    const searchProductUseCase: SearchProductUseCase.UseCase = container.resolve('SearchProductUseCase')

    const input: SearchProductUseCase.Input = {
        page,
        per_page,
        sort,
        sort_dir,
        filter
    }
    const result = await searchProductUseCase.execute(input)
    
    return res.status(200).json(result.items)
}

export default searchProductController
