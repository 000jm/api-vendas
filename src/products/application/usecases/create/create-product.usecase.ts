
import BadRequestError from "@/common/domain/errors/bad-request-error.ts"
import type { ProductsRepository } from "@/products/domain/repositories/product.repository.ts"
import { inject, injectable } from "tsyringe"
import ProductOutput from "../dtos/product-output.dto.ts"

namespace CreateProductUseCase {

    export type Input = {
        name: string
        price: number
        quantity: number
    }

    export type Output = ProductOutput

    @injectable()
    export class UseCase {
        constructor(
            @inject('ProductRepository') 
            private productsRepository: ProductsRepository,
        ) {}

        async execute(input: Input): Promise<Output> {
            if(!input.name || input.price <= 0 || input.price === undefined || input.quantity <= 0 || input.quantity === undefined) throw new BadRequestError('Input data not provided or invalid')

            await this.productsRepository.conflictingName(input.name)
                
            // const product: ProductOutput = this.productsRepository.create(input)
            const product = this.productsRepository.create(input)
            await this.productsRepository.insert(product)

            return product
        }
    }

}

export default CreateProductUseCase
