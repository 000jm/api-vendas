
import { Request, Response } from "express"
import z from "zod"
import CreateProductUseCase from "@/products/application/usecases/create/create-product.usecase.ts"
import '@/common/infrastructure/container'
import { container } from "tsyringe"
import dataValidation from "@/common/infrastructure/validation/zod/index.ts"

async function createProductController(req: Request, res: Response) {

    const createProductSchema = z.object({
        name: z.string(),
        price: z.number(),
        quantity: z.number()
    })

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
