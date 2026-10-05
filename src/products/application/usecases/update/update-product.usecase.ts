
import type { ProductsRepository } from "@/products/domain/repositories/product.repository.ts"
import { inject, injectable } from "tsyringe"
import ProductOutput from "../dtos/product-output.dto.ts"

namespace UpdateProductUseCase {

    export type Input = {
        id: string
        name?: string
        price?: number
        quantity?: number
    }

    export type Output = ProductOutput

    @injectable()
    export class UseCase {
        constructor(
            @inject('ProductRepository')
            private productsRepository: ProductsRepository,
        ) {}

        async execute(input: Input): Promise<Output> {

            const product = await this.productsRepository.update(input)

            return {
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: product.quantity,
                created_at: product.created_at,
                updated_at: product.updated_at
            }

        }
    }

}

export default UpdateProductUseCase
