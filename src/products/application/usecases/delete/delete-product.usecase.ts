
import { inject, injectable } from "tsyringe"
import ProductOutput from "../dtos/product-output.dto"
import BadRequestError from "@/common/domain/errors/bad-request-error"
import type { ProductsRepository } from "@/products/domain/repositories/product.repository"

namespace DeleteProductUseCase {

    export type Input = {
        id: string
    }

    export type Output = void

    @injectable()
    export class UseCase {
        constructor(
            @inject('ProductRepository') 
            private productsRepository: ProductsRepository,
        ) {}

        async execute(input: Input): Promise<Output> {
            if(!input) {
                throw new BadRequestError('Input data not provided or invalid')
            }

            return await this.productsRepository.delete(input.id)
        }
    }

}

export default DeleteProductUseCase
