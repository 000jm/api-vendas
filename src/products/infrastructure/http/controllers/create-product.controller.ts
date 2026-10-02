
import AppError from "@/common/domain/errors/app-errors.ts"
import { Request, Response } from "express"
import z from "zod"
import CreateProductUseCase from "@/products/application/usecases/create-product.usecase.ts"
import '@/common/infrastructure/container'
import { container } from "tsyringe"

async function createProductController(req: Request, res: Response) {

    const createProductSchema = z.object({
        name: z.string(),
        price: z.number(),
        quantity: z.number()
    })

    const validData = createProductSchema.safeParse(req.body)
    if(!validData.success) {
        console.error('Invalid data', validData.error)
        throw new AppError(`deu erro`)
    }

    const { name, price, quantity } = validData.data

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
