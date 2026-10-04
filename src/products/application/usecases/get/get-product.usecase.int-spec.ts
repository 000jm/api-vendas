
import 'reflect-metadata'
import { describe, expect, it, jest } from '@jest/globals'
import GetProductUseCase from './get-product.usecase.ts'
import { ProductsRepository } from "@/products/domain/repositories/product.repository.ts"
import ProductsInMemoryRepository from "@/products/infrastructure/in-memory/repositories/products-in-memory.repository.ts"
import NotFoundError from '@/common/domain/errors/not-found-error.ts'

describe('get UseCase Unit Tests', () => {
    let sut: GetProductUseCase.UseCase
    let repository: ProductsRepository
    
    beforeEach(() => {
        repository = new ProductsInMemoryRepository()
        sut = new GetProductUseCase.UseCase(repository)
    })

    it('should find a product', async () => {
        const spyFindById = jest.spyOn(repository, 'findById')
        const productInput = {
            name: 'Product001',
            price: 22,
            quantity: 22
        }
        const product = await repository.insert(repository.create(productInput))
        const input = {
            id: product.id
        }
        const result = await sut.execute(input)

        expect(spyFindById).toHaveBeenCalledTimes(1)
        expect(result).toStrictEqual(product)
    })

    it('should not find a product', async () => {
        await expect(sut.execute({ id: 'fake-id' })).rejects.toThrow(new NotFoundError(`Model not found with id fake-id`))
        await expect(sut.execute({ id: 'fake-id' })).rejects.toBeInstanceOf(NotFoundError)
    })

})
