import type { ProductsRepository } from '@/products/domain/repositories/product.repository'
import { inject, injectable } from 'tsyringe'
import type ProductOutput from '../dtos/product-output.dto'

export namespace DeleteProductUseCase {

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
            await this.productsRepository.delete(input.id)
        }

    }

}

export default DeleteProductUseCase
