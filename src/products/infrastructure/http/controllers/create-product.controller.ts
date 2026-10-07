
import { Request, Response } from "express"
import CreateProductUseCase from "@/products/application/usecases/create/create-product.usecase.ts"
import '@/common/infrastructure/container'
import { container } from "tsyringe"
import dataValidation from "@/common/infrastructure/validation/zod/index.ts"
import { createProductSchema } from "../schemas/product.schemas"

async function createProductController(req: Request, res: Response): Promise<Response> {

    const validData = await dataValidation(createProductSchema, req.body)
    const { name, price, quantity } = validData

    const createProductUseCase: CreateProductUseCase.UseCase = container.resolve('CreateProductUseCase')

    const input = {
        name,
        price,
        quantity
    }
    const product = await createProductUseCase.execute(input)

    return res.status(201).json(product)
}

export default createProductController
