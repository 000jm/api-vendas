
import testDataSource from "@/products/infrastructure/typeorm/testing/data-source.ts"
import ProductsTypeormRepository from "./products-typeorm.repository.ts"
import Product from "../entities/products.entity.ts"
import NotFoundError from "@/common/domain/errors/not-found-error.ts"
import { randomUUID } from "node:crypto"
import ProductsDataBuilder from "../../testing/helpers/products-data-builder.ts"
import ConflictError from "@/common/domain/errors/conflict-error.ts"
import { SearchInput } from "@/common/domain/repository/repository.interface.ts"
import ProductModel from "@/products/domain/models/products.model.ts"
import { describe, expect, it } from '@jest/globals'

describe('ProductsTypeormRepository integration tests', () => {
    let ormRepository: ProductsTypeormRepository

    beforeAll(async () => {
        await testDataSource.initialize()
    })

    afterAll(async () => {
        await testDataSource.destroy()
    })

    beforeEach(async () => {
        await testDataSource.manager.query('DELETE FROM products')
        ormRepository = new ProductsTypeormRepository()
        ormRepository.productsRepository = testDataSource.getRepository(Product)
    })

    describe('create', () => {
        it('should create a product', async () => {
            const data = await ProductsDataBuilder({})
            const result = ormRepository.create(data)
            expect(result.updated_at).toStrictEqual(data.updated_at)
        })
    })

    describe('insert', () => {
        it('should insert a product', async () => {
            const id = randomUUID()
            const data = await ProductsDataBuilder({ id })
            // const product = ormRepository.create(data)
            // const productResult = await ormRepository.insert(product)
            const product = await ormRepository.insert(data)
            const result = await ormRepository.findById(product.id)
            expect(result.id).toStrictEqual(product.id)
            // expect(result.id).toStrictEqual(productResult.id)
        })
    })

    describe('findById', () => {
            it('should generate an error when product is not found', async () => {
                const id = randomUUID()
                await expect(ormRepository.findById(id)).rejects.toThrow(
                    new NotFoundError(`Product not found with id: ${id}`)
                )
            })

            it('should find a product by id', async () => {
                const id = randomUUID()
                const data = await ProductsDataBuilder({ id, name: 'creme', price: 150, quantity: 10, created_at: new Date('2025-01-15T10:30:00'), updated_at: new Date('2025-01-15T10:30:00') })
                const product = testDataSource.manager.create(Product, data)
                await testDataSource.manager.save(product)
                const result = await ormRepository.findById(data.id)
                expect(result).toStrictEqual(product)
            })
    })

    describe('update', () => {
        it('should not update a product', async () => {
            const data = await ProductsDataBuilder({ id: randomUUID() })
            const result = ormRepository.update(data)
            await expect(result).rejects.toThrow(
                new NotFoundError(`Product not found with id: ${data.id}`)
            )
        })

        it('should update a product', async () => {
            const id = randomUUID()
            const data = await ProductsDataBuilder({ id, name: 'hello' })
            const newData = await ProductsDataBuilder({ id, name: 'oi' })
            await ormRepository.insert(data)
            await ormRepository.insert(newData)
            const result = await ormRepository.update(data)
            expect(result.name).toStrictEqual(data.name)
        })
    })

    describe('delete', () => {
        it('should not delete and throw error', async () => {
            const id = randomUUID()
            const result = ormRepository.delete(id)
            await expect(result).rejects.toThrow(
                new NotFoundError(`Product not found with id: ${id}`)
            )
        })

        it('should delete', async () => {
            const id = randomUUID()
            const data = await ormRepository.insert(await ProductsDataBuilder({ id }))
            await ormRepository.delete(data.id)
            // const result = await ormRepository.delete(data.id)
            // const result = ormRepository.delete(data.id)
            const result = await ormRepository.productsRepository.findOneBy({id})
            expect(result).toBeNull()
            // const result = ormRepository.delete(data.id)
            // expect(result).toBeUndefined()
            // await expect(result).resolves.toBeUndefined()
        })
    })

    describe('findByName', () => {
        it('should not find a product by it name', async () => {
            const name:string = 'hello'
            const result = ormRepository.findByName(name)
            await expect(result).rejects.toThrow(
                new NotFoundError(`Product not found with name: ${name}`)
            )
        })

        it('should not find a product by it name', async () => {
            const data = await ormRepository.insert(await ProductsDataBuilder({ name: 'joao' }))
            await ormRepository.insert(await ProductsDataBuilder({ name: 'miguel' }))
            const result = await ormRepository.findByName(data.name)
            expect(result.name).toStrictEqual('joao')
        })
    })

    describe('conflictingName', () => {
        it('should not confict name', async () => {
            const name = 'esse nome nao existe'
            const result = await ormRepository.conflictingName(name)
            expect(result).toBeUndefined()
        })

        it('should conflict name', async () => {
            const name = 'esse nome ja existe'
            await ormRepository.insert(await ProductsDataBuilder({ name }))
            const result = ormRepository.conflictingName(name)
            await expect(result).rejects.toThrow(
                new ConflictError(`Product ${name} already in use`)
            )
        })
    })

    describe('findByAllIds', () => {
        it('should not found products', async () => {
            const result = await ormRepository.findByAllIds([{id: randomUUID()}, {id: randomUUID()}, {id: randomUUID()}])
            expect(result).toHaveLength(0)
        })
        
        it('should found products', async () => {
            const id1 = randomUUID()
            const id2 = randomUUID()
            const id3 = randomUUID()
            const um = await ormRepository.insert(await ProductsDataBuilder({ id: id1 }))
            const dois = await ormRepository.insert(await ProductsDataBuilder({ id: id2 }))
            const tres = await ormRepository.insert(await ProductsDataBuilder({ id: id3 }))
            const result = await ormRepository.findByAllIds([{ id: id1 }, { id: id2 }])
            expect([result[0].id, result[1].id]).toStrictEqual([um.id, dois.id])
        })
    })

    describe('search', () => {
        it('should apply paginate', async () => {
            // const products = [
            // {
            //     id: randomUUID(),
            //     name: 'Mouse',
            //     price: 100,
            //     quantity: 10,
            //     created_at: new Date(),
            //     updated_at: new Date(),
            // },
            // {
            //     id: randomUUID(),
            //     name: 'Teclado',
            //     price: 150,
            //     quantity: 15,
            //     created_at: new Date(),
            //     updated_at: new Date(),
            // },
            // {
            //     id: randomUUID(),
            //     name: 'Cabo HDMI',
            //     price: 200,
            //     quantity: 20,
            //     created_at: new Date(),
            //     updated_at: new Date(),
            // },
            // {
            //     id: randomUUID(),
            //     name: 'Webcam',
            //     price: 250,
            //     quantity: 25,
            //     created_at: new Date(),
            //     updated_at: new Date(),
            // },
            // {
            //     id: randomUUID(),
            //     name: 'Headset',
            //     price: 300,
            //     quantity: 30,
            //     created_at: new Date(),
            //     updated_at: new Date(),
            // },
            // {
            //     id: randomUUID(),
            //     name: 'Mouse Gamer',
            //     price: 350,
            //     quantity: 35,
            //     created_at: new Date(),
            //     updated_at: new Date(),
            // },
            // {
            //     id: randomUUID(),
            //     name: 'Suporte Notebook',
            //     price: 400,
            //     quantity: 40,
            //     created_at: new Date(),
            //     updated_at: new Date(),
            // },
            // {
            //     id: randomUUID(),
            //     name: 'SSD',
            //     price: 450,
            //     quantity: 45,
            //     created_at: new Date(),
            //     updated_at: new Date(),
            // },
            // {
            //     id: randomUUID(),
            //     name: 'HD Externo',
            //     price: 500,
            //     quantity: 50,
            //     created_at: new Date(),
            //     updated_at: new Date(),
            // },
            // {
            //     id: randomUUID(),
            //     name: 'Microfone',
            //     price: 550,
            //     quantity: 12,
            //     created_at: new Date(),
            //     updated_at: new Date(),
            // },
            // {
            //     id: randomUUID(),
            //     name: 'Caixa de Som',
            //     price: 600,
            //     quantity: 18,
            //     created_at: new Date(),
            //     updated_at: new Date(),
            // },
            // {
            //     id: randomUUID(),
            //     name: 'Hub USB',
            //     price: 180,
            //     quantity: 22,
            //     created_at: new Date(),
            //     updated_at: new Date(),
            // },
            // {
            //     id: randomUUID(),
            //     name: 'Controle',
            //     price: 320,
            //     quantity: 28,
            //     created_at: new Date(),
            //     updated_at: new Date(),
            // },
            // {
            //     id: randomUUID(),
            //     name: 'Fone Bluetooth',
            //     price: 480,
            //     quantity: 33,
            //     created_at: new Date(),
            //     updated_at: new Date(),
            // },
            // {
            //     id: randomUUID(),
            //     name: 'Teclado Mecânico',
            //     price: 590,
            //     quantity: 42,
            //     created_at: new Date(),
            //     updated_at: new Date(),
            // },
            // ]
            const products = [
            {
                id: randomUUID(),
                name: 'Mouse',
                price: 1,
                quantity: 10,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: randomUUID(),
                name: 'Mouse Gamer',
                price: 250,
                quantity: 20,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: randomUUID(),
                name: 'Mouse Wireless',
                price: 180,
                quantity: 15,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: randomUUID(),
                name: 'Teclado',
                price: 150,
                quantity: 25,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: randomUUID(),
                name: 'Teclado Mecânico',
                price: 400,
                quantity: 30,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: randomUUID(),
                name: 'Teclado Gamer',
                price: 350,
                quantity: 18,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: randomUUID(),
                name: 'Monitor',
                price: 800,
                quantity: 12,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: randomUUID(),
                name: 'Monitor Gamer',
                price: 1200,
                quantity: 10,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: randomUUID(),
                name: 'Headset',
                price: 300,
                quantity: 22,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: randomUUID(),
                name: 'Headset Gamer',
                price: 500,
                quantity: 16,
                created_at: new Date(),
                updated_at: new Date(),
            },
            ]
            for(const product of products) {
                // await testDataSource.manager.save(Product, product)
                await ormRepository.insert(product)
            }
            // const products = Array(20).fill(await ProductsDataBuilder({})
            const options: SearchInput = {
                page: 1,
                per_page: 10,
                sort: null,
                sort_dir: null,
                filter: null
            }
            const result = await ormRepository.search(options)
            // expect(result.items).toStrictEqual(products)
            // expect(result.items).toHaveLength(5)
            // expect(result.total).toBe(10)
            // expect(result.items[1].id).toBe(products[1].id)
            // expect(result.current_page).toBe(1)
            // expect(result.per_page).toBe(5)
        })

        it('should order by created at when search params is null', async () => {
            const created_at = new Date()
            const models: ProductModel[] = []
            const arrange = await Promise.all(Array.from({ length: 20 }, () => ProductsDataBuilder({})))
            
            arrange.forEach((element, index) => {
                
                models.push({
                    ...element,
                    name: `Product ${index + 1} and Product position ${index}`,
                    created_at: new Date(created_at.getTime() + index)
                })
                
            })

            const data = testDataSource.manager.create(Product, models)
            await testDataSource.manager.save(data)

            const options: SearchInput = {
                // page: 1,
                per_page: 15,
                sort: null,
                // sort_dir: null,
                // filter: null
            }
            const result = await ormRepository.search(options)
            // console.log(result.items)
            // expect(result.items).toStrictEqual([models[0], models[1], models[2], models[3], models[4], models[5], models[6], models[7], models[8], models[9], models[10], models[11], models[12], models[13], models[14]])
            // expect(result.items).toStrictEqual([models[14], models[13], models[12], models[11], models[10], models[9], models[8], models[7], models[6], models[5], models[4], models[3], models[2], models[1], models[0]])
            // expect(result.items).toStrictEqual([models[19], models[18], models[17], models[16], models[15], models[14], models[13], models[12], models[11], models[10], models[9], models[8], models[7], models[6], models[5]])
            // expect(result.items[3].name).toStrictEqual("Product 17 and Product position 16")
            expect(result.sort).toBe('created_at')
        })

        it('should order and paginate', async () => {
            const created_at = new Date()
            const models: ProductModel[] = []
            await Promise.all('bcaed'.split('').map(async (element, index) => {
                models.push({
                    ...await ProductsDataBuilder({}),
                    name: element,
                    created_at: new Date(created_at.getTime() + index)
                })
            }))

            const data = testDataSource.manager.create(Product, models)
            await testDataSource.manager.save(data)

            const options: SearchInput = {
                page: 3,
                per_page: 2,
                sort: 'name',
                sort_dir: null,
                filter: null
            }
            const result = await ormRepository.search(options)
            expect(result.items[0].name).toEqual('a')
            expect(result.items.length).toBe(1)
        })

        it('should filter, order and paginate', async () => {
            const created_at = new Date()
            const models: ProductModel[] = []
            const names = ['test', 'Test', 'oI', 'OI', 'hello']
            await Promise.all(names.map(async (element, index) => {
                models.push({
                    ...await ProductsDataBuilder({}),
                    name: element,
                    created_at: new Date(created_at.getTime() + index)
                })
            }))

            const data = testDataSource.manager.create(Product, models)
            await testDataSource.manager.save(data)

            const options: SearchInput = {
                page: null,
                // per_page: null,
                sort: 'name',
                sort_dir: 'DesC',
                filter: 'oi'
            }
            const result = await ormRepository.search(options)
            // console.log(result.items)
            expect(result.items[0].name).toEqual('OI')
            expect(result.items[1].name).toEqual('oI')
            expect(result.items.length).toBe(2)
        })
    })

})

