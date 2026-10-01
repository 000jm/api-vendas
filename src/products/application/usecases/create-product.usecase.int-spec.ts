
import CreateProductUseCase from "./create-product.usecase.ts"
import testDataSource from "@/products/infrastructure/typeorm/testing/data-source.ts"
import { ProductsRepository } from "@/products/domain/repositories/product.repository.ts"
import ProductsInMemoryRepository from "@/products/infrastructure/in-memory/repositories/products-in-memory.repository.ts"
import { describe, expect, it, jest } from '@jest/globals'

describe('UseCase Unit Tests', () => {
    let sut: CreateProductUseCase.UseCase
    let repository: ProductsRepository
    
    beforeEach(() => {
        repository = new ProductsInMemoryRepository()
        sut = new CreateProductUseCase.UseCase(repository)
        // testDataSource.initialize()
    })

    afterEach(() => {
        // testDataSource.destroy()
    })

    it('should create a product', async () => {
        const spyInsert = jest.spyOn(repository, 'insert')
        const input = {
            name: 'Product 1',
            price: 10,
            quantity: 5
        }
        const result = await sut.execute(input)

        expect(result.id).toBeDefined()
        expect(result.created_at).toBeDefined()
        expect(result.updated_at).toBeDefined()
        expect(spyInsert).toHaveBeenCalledTimes(1)
    })
})
