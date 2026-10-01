
import ConflictError from '@/common/domain/errors/conflict-error.ts'
import ProductsDataBuilder from './products-data-builder.ts'
import ProductsInMemoryRepository from '../../in-memory/repositories/products-in-memory.repository.ts'
import NotFoundError from '@/common/domain/errors/not-found-error.ts'
import ProductModel from '@/products/domain/models/products.model.ts'
import { describe, expect, it, jest } from '@jest/globals'

describe('ProductInMemoryRepository unit tests', () => {
  let sut: ProductsInMemoryRepository

  beforeEach(() => {
    sut = new ProductsInMemoryRepository()

    return
  })

    describe('findByName', () => {
      it('should not find by name', async () => {
        const name = 'esse nome nao existe'
        expect(sut.findByName(name)).rejects.toThrow(
          new NotFoundError(`Product not found with name: ${name}`),
        )
      })

      it('should not find by name', async () => {
        const data = await ProductsDataBuilder({ name: 'gg guys' })
        sut.items.push(data)
        const result = await sut.findByName('gg guys')
        expect(result).toStrictEqual(data)
      })
    })

    describe('findByAllIds', () => {
      it('should not found any item', async () => {
        const data: ProductModel[] = [
          await ProductsDataBuilder({ id: 'sameid' }),
          await ProductsDataBuilder({ id: 'sameid' }),
          await ProductsDataBuilder({ id: 'nadaaver' }),
          await ProductsDataBuilder({ id: 'tudoaver' }),
        ]
        sut.items = data
        const result = sut.findByAllIds([{ id: 'sameid' }, { id: 'sameid' }])
        await expect(result).rejects.toThrow(
          new ConflictError('Only diferent ids'),
        )

        // await expect(result).rejects.toThrow(
        //     new NotFoundError('Product not found')
        // )
      })

      it('should found by all ids', async () => {
        const data = [
          await ProductsDataBuilder({ id: 'sameid' }),
          await ProductsDataBuilder({ id: 'sameid' }),
          await ProductsDataBuilder({ id: 'nadaaver' }),
          await ProductsDataBuilder({ id: 'tudoaver' }),
        ]
        sut.items = data
        const result = await sut.findByAllIds([
          { id: 'nadaaver' },
          { id: 'tudoaver' },
        ])
        expect(result).toStrictEqual([data[2], data[3]])
      })
    })

    describe('conflictingName', () => {
      it('should found the conflicting name', async () => {
        const data = [
          await ProductsDataBuilder({ name: 'sameid' }),
          await ProductsDataBuilder({ name: 'sameid' }),
          await ProductsDataBuilder({ name: 'nadaaver' }),
          await ProductsDataBuilder({ name: 'tudoaver' }),
        ]
        sut.items = data
        const result = sut.conflictingName('nadaaver')
        await expect(result).rejects.toBeInstanceOf(ConflictError)
      })

      it('should not find product by name', async () => {
        expect.assertions(0)
        await sut.conflictingName('esse nome nao existe')
      })
    })

    describe('applyFilter', () => {
      it('should not show any items', async () => {
        const data = [
          await ProductsDataBuilder({ name: 'joao' }),
          await ProductsDataBuilder({ name: 'jOaO' }),
          await ProductsDataBuilder({ name: 'miGuel' }),
        ]
        sut.items = data
        const filter = 'pedrao'
        const spyFilter = jest.spyOn(sut.items, 'filter')
        const result = sut['applyFilter'](sut.items, filter)
        expect(spyFilter).toHaveBeenCalled()
        await expect(result).rejects.toThrow(
          new NotFoundError(`Product not found with name: ${filter}`),
        )

        // const spy = jest.spyOn(sut.items, 'filter')
        // const result = await sut['applyFilter'](sut.items, null)
        // expect(spy).not.toHaveBeenCalled()
        // expect(result).toStrictEqual(sut.items)
      })

      it('should filter items', async () => {
        const data = [
          await ProductsDataBuilder({ name: 'joao' }),
          await ProductsDataBuilder({ name: 'jOaO' }),
          await ProductsDataBuilder({ name: 'miGuel' }),
        ]
        sut.items = data
        const result = await sut['applyFilter'](sut.items, 'joao')
        expect(result).toStrictEqual([data[0], data[1]])
      })
    })

    describe('applySort', () => {
      it('should sort items by default', async () => {
        sut.sortableFields = ['name', 'price', 'created_at']
        const data = [
          await ProductsDataBuilder({}),
          await ProductsDataBuilder({}),
          await ProductsDataBuilder({}),
        ]
        sut.items = data
        const result = await sut['applySort'](data)
        expect(result).toStrictEqual([data[0], data[1], data[2]])
      })

      it('should sort items', async () => {
        sut.sortableFields = ['name', 'price', 'created_at', 'quantity']
        const data = [
          await ProductsDataBuilder({ price: 99.9, quantity: 1 }),
          await ProductsDataBuilder({ price: 101.9, quantity: 3 }),
          await ProductsDataBuilder({ price: 100.9, quantity: 2 }),
        ]
        sut.items = data
        const result = await sut['applySort'](data, 'quantity', 'asc')
        expect(result).toStrictEqual([data[0], data[2], data[1]])
      })
    })

})
