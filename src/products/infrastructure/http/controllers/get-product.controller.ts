
import { Request, Response } from "express"
import z from "zod"
import '@/common/infrastructure/container'
import { container } from "tsyringe"
import GetProductUseCase from "@/products/application/usecases/get/get-product.usecase.ts"
import dataValidation from "@/common/infrastructure/validation/zod"

async function getProductController(req: Request, res: Response) {

    const getProductSchema = z.object({
        id: z.string()
    })

    const validData = await dataValidation(getProductSchema, req.params)
    const id = validData.id

    const getProductUseCase: GetProductUseCase.UseCase = container.resolve('GetProductUseCase')

    const input = {
        id
    }
    const product = await getProductUseCase.execute(input)

    return res.status(200).json(product)
}

export default getProductController
