
import AppError from "@/common/domain/errors/app-errors.ts";
import { Request, Response } from "express";
import z from "zod";
import ProductsTypeormRepository from "../../typeorm/repositories/products-typeorm.repository.ts";
import dataSource from "@/common/infrastructure/typeorm/index.ts";
import Product from "../../typeorm/entities/products.entity.ts";
import CreateProductUseCase from "@/products/application/usecases/create-product.usecase.ts";

async function createProductController(req: Request, res: Response) {

    const createProductSchema = z.object({
        name: z.string(),
        price: z.number(),
        quantity: z.number()
    })

    const validData = createProductSchema.safeParse(req.body)
    if(validData.success === false) {
        console.error('Invalid data', validData.error)
        throw new AppError(`deu erro`)
    }

    const { name, price, quantity } = validData.data
    
    const repository = new ProductsTypeormRepository()
    repository.productsRepository = dataSource.getRepository(Product)
    const createProductUseCase = new CreateProductUseCase.UseCase(repository)

    const input = {
        name,
        price,
        quantity
    }
    const product = await createProductUseCase.execute(input)

    return res.status(201).json(product)
}

export default createProductController
