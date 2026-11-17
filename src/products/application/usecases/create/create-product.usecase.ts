import BadRequestError from '@/common/domain/errors/bad-request-error'
import type { ProductsRepository } from '@/products/domain/repositories/product.repository'
import { inject, injectable } from 'tsyringe'
import type ProductOutput from '../dtos/product-output.dto'

export namespace CreateProductUseCase {

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

            const name = input.name?.trim()

            if (!name || !input.price || input.price <= 0 || !input.quantity || input.quantity <= 0) {
                throw new BadRequestError('Dados do produto inválidos')
            }

            await this.productsRepository.conflictingName(name)

            const product = this.productsRepository.create({
                name,
                price: input.price,
                quantity: input.quantity
            })

            await this.productsRepository.insert(product)

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

export default CreateProductUseCase
