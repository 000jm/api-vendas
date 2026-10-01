
import { describe, expect, it, jest } from '@jest/globals'
import CreateProductUseCase from "./create-product.usecase.ts"
import { ProductsRepository } from "@/products/domain/repositories/product.repository.ts"
import ProductsInMemoryRepository from "@/products/infrastructure/in-memory/repositories/products-in-memory.repository.ts"
import BadRequestError from "@/common/domain/errors/bad-request-error.ts"
import ConflictError from "@/common/domain/errors/conflict-error.ts"

describe('UseCase Unit Tests', () => {
    let sut: CreateProductUseCase.UseCase
    let repository: ProductsRepository
    
    beforeEach(() => {
        repository = new ProductsInMemoryRepository()
        sut = new CreateProductUseCase.UseCase(repository)
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

    it('should not possible to register a product with the name of another product', async () => {
        const product1 = {
            name: 'Product 1',
            price: 10,
            quantity: 5
        }
        const input = {
            name: 'Product 1',
            price: 5,
            quantity: 10
        }

        await sut.execute(input)
        await expect(sut.execute(input)).rejects.toThrow(
            new ConflictError(`Name already exists: ${input.name}`)
        )
        await expect(sut.execute(input)).rejects.toBeInstanceOf(ConflictError)
    })

    it('should throw error when name is not provided correctly', async () => {
        const input = {
            name: null,
            quantity: 10,
            price: 5
        }

        const result = sut.execute(input)
        await expect(result).rejects.toThrow(
            new BadRequestError('Input data not provided or invalid')
        )
        await expect(result).rejects.toBeInstanceOf(BadRequestError)
    })

    it('should error when price is not provided correctly', async () => {
        const input = {
            name: 'product',
            price: -13,
            quantity: 10
        }

        const result = sut.execute(input)
        await expect(result).rejects.toThrow(
            new BadRequestError('Input data not provided or invalid')
        )
        await expect(result).rejects.toBeInstanceOf(BadRequestError)
    })

    it('should throw error when quantity is not provided correctly', async () => {
        const input = {
            name: 'product',
            price: +22,
            quantity: undefined
        }

        const result = sut.execute(input)
        await expect(result).rejects.toThrow(
            new BadRequestError('Input data not provided or invalid')
        )
        await expect(result).rejects.toBeInstanceOf(BadRequestError)
    })

})
