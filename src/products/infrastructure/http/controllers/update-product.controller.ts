
import { Request, Response } from "express"
import z from "zod"
import '@/common/infrastructure/container'
import { container } from "tsyringe"
import dataValidation from "@/common/infrastructure/validation/zod"
import UpdateProductUseCase from "@/products/application/usecases/update/update-product.usecase"
import ProductModel from "@/products/domain/models/products.model"
import AppError from "@/common/domain/errors/app-errors"

async function updateProductController(req: Request, res: Response) {

    const updateProductIdSchema = z.object({
        id: z.string(),
    })

    const updateProductSchema = z.object({
        name: z.string().optional(),
        price: z.number().optional(),
        quantity: z.number().optional(),
    })

    const validDataId = await dataValidation(updateProductIdSchema, req.params)
    const id = validDataId.id

    const validData = await dataValidation(updateProductSchema, req.body)
    const { name, price, quantity } = validData
    if(name === undefined && price === undefined && quantity === undefined) {
        throw new AppError('Invalid data')
    }

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
