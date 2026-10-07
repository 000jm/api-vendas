
import { Request, Response } from "express"
import z from "zod"
import '@/common/infrastructure/container'
import { container } from "tsyringe"
import SearchProductUseCase from "@/products/application/usecases/search/search-product.usecase"
import dataValidation from "@/common/infrastructure/validation/zod"
import { searchProductSchema } from "../schemas/product.schemas"

async function searchProductController(req: Request, res: Response): Promise<Response> {

    const validData = await dataValidation(searchProductSchema, req.body)
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
