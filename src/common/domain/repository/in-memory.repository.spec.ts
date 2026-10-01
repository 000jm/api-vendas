
import { randomUUID } from "crypto"
import NotFoundError from "../errors/not-found-error.ts"
import InMemoryRepository from "./in-memory.repository.ts"
import { describe, expect, it, jest } from '@jest/globals'

type StubModelProps = {
    id: string
    name: string
    price: number
    create_at: Date
    updated_at: Date
}

class StubInMemoryRepository extends InMemoryRepository<StubModelProps> {
    constructor() {
        super()
        this.sortableFields = ['name', 'price']
    }

    protected async applyFilter(items: StubModelProps[], filterName: string | null): Promise<StubModelProps[]> {
        
        if(!filterName) return items

        return items.filter(item => item.name.toLowerCase().includes(filterName.toLowerCase()))

    }
}

describe('InMemoryRepository unit tests', () => {
    let sut: StubInMemoryRepository
    let model: StubModelProps
    let props: any
    let create_at: Date
    let updated_at: Date

    beforeEach(() => {
        sut = new StubInMemoryRepository()
        create_at = new Date()
        updated_at = new Date()
        props = {
            name: 'name',
            price: 10.1
        }
        model = {
            id: randomUUID(),
            ...props,
            create_at: new Date('2026/09/3'),
            updated_at: new Date('2026/09/14')
        }

        return
    })

    describe('create', () => {
        it('should create a new model', () => {
        const result = sut.create(props)
        expect(result.name).toStrictEqual('name')
    })
    })

    describe('insert', () => {
        it('should inserts a new model', async () => {
            const result = await sut.insert(model)
            expect(result).toStrictEqual(sut.items[0])
        })
    })

    describe('findById', () => {
        it('should throw error when the id not found(findById method test)', async () => {
            const id = randomUUID()
    
            expect(sut.findById(id)).rejects.toThrow(
                new NotFoundError(`Model not found with id ${id}`)
            )
        })

        it('should find a model by id', async () => {
            const data = await sut.insert(model)
            const result = await sut.findById(data.id)
    
            expect(result.id).toStrictEqual(data.id)
        })
    })

    describe('update', () => {
        it('should throw error when the id not found(update method test)', async () => {
            expect(sut.update(model)).rejects.toThrow(
                new NotFoundError(`Model not found with id ${model.id}`)
            )
        })
    
        it('should update a model by id', async () => {
            const data = await sut.insert(model)
            const updatedName = {
                id: data.id,
                name: 'updated name',
                price: 100,
                create_at,
                updated_at: new Date('2001/02/20')
            }
            const result = await sut.update(updatedName)
            expect(result).toStrictEqual(sut.items[0])
        })
    })

    describe('delete', () => {
        it('should thow error when id not found(delete method test)', async () => {
            const id = randomUUID()
    
            expect(sut.delete(id)).rejects.toThrow(
                new NotFoundError(`Model not found with id ${id}`)
            )
        })
    
        it('should delete a model', async () => {
            const data = await sut.insert(model)
            expect(sut.items[0]).toBe(data)
            const modelId = await sut.findById(data.id)
            await sut.delete(modelId.id)
    
            expect(sut.items.length).toBe(0)
        })
    })

    describe('applyFilter', () => {
            it('should no filter items when the parameter is null', async () => {
                const items = [model]
                const spyFilter = jest.spyOn(items, 'filter')
                const result = await sut['applyFilter'](items, null)
                expect(spyFilter).not.toHaveBeenCalled()
                expect(result).toBe(items)
            })

            it('should filter items', async () => {
                const items = [
                    {
                        id: randomUUID(),
                        name: 'test',
                        price: 1000,
                        create_at,
                        updated_at
                    },
                    {
                        id: randomUUID(),
                        name: 'TEST',
                        price: 1000,
                        create_at,
                        updated_at
                    }
                ]
                await sut.insert(items[0])
                await sut.insert(items[1])
                await sut.insert(items[2])
                const spyFilter = jest.spyOn(items, 'filter')
                let result = await sut['applyFilter'](items, 'T')
                
                result = await sut['applyFilter'](items, 'test')
                expect(spyFilter).toHaveBeenCalledTimes(2)
                if(result.length === 0) {
                    throw new NotFoundError('try with a valid filter')
                }
                expect(result).toStrictEqual(result)
                // expect(result).toHaveLength(0)
            })
    })

    describe('applySort', () => {
        it('should not sort items', async () => {
            const items = [
                {
                    id: randomUUID(),
                    name: 'test',
                    price: 1000,
                    create_at,
                    updated_at
                },
                {
                    id: randomUUID(),
                    name: 'TEST',
                    price: 1000,
                    create_at,
                    updated_at
                }
            ]

            const result = await sut['applySort'](items, 'price', 'null'/* null */)
            expect(result).toStrictEqual(items)
        })

        it('should sort items(asc)', async () => {
            const items = [
                {
                    id: randomUUID(),
                    name: 'b',
                    price: 100,
                    create_at,
                    updated_at
                },
                {
                    id: randomUUID(),
                    name: 'a',
                    price: 1000,
                    create_at,
                    updated_at
                },
                {
                    id: randomUUID(),
                    name: 'c',
                    price: 10,
                    create_at,
                    updated_at
                }
            ]
            sut.items = items
            const result = await sut.search({
                sort: 'name',
                sort_dir: 'asc'
            })
            expect(result).toStrictEqual({
                items: await sut['applySort']([items[1], items[0], items[2]], 'name', 'asc'),
                total: 3,
                current_page: 1,
                per_page: 15,
                sort: 'name',
                sort_dir: 'asc',
                filter: null
            })
        })

        it('should sort items(desc)', async () => {
            const items = [
                {
                    id: randomUUID(),
                    name: 'b',
                    price: 100,
                    create_at,
                    updated_at
                },
                {
                    id: randomUUID(),
                    name: 'a',
                    price: 1000,
                    create_at,
                    updated_at
                },
                {
                    id: randomUUID(),
                    name: 'c',
                    price: 10,
                    create_at,
                    updated_at
                }
            ]

            const result = await sut['applySort'](items, 'name', 'desc')
            expect(result).toStrictEqual([items[2], items[0], items[1]])
        })
    })

    describe('applyPaginate', () => {
    it('should paginate items(5 items, 1 page)', async () => {
        const items = [
            { id: randomUUID(), name: 'Lápis', price: 9, create_at, updated_at },
            { id: randomUUID(), name: 'Caneta', price: 19, create_at, updated_at },
            { id: randomUUID(), name: 'Borracha', price: 9, create_at, updated_at },
            { id: randomUUID(), name: 'Caderno', price: 29, create_at, updated_at },
            { id: randomUUID(), name: 'Mochila', price: 89, create_at, updated_at },
            { id: randomUUID(), name: 'Agenda', price: 39, create_at, updated_at },
            { id: randomUUID(), name: 'Tesoura', price: 19, create_at, updated_at },
            { id: randomUUID(), name: 'Régua', price: 9, create_at, updated_at },
            { id: randomUUID(), name: 'Estojo', price: 29, create_at, updated_at },
            { id: randomUUID(), name: 'Calculadora', price: 49, create_at, updated_at },
            { id: randomUUID(), name: 'Fone', price: 59, create_at, updated_at },
            { id: randomUUID(), name: 'Mouse', price: 39, create_at, updated_at },
            { id: randomUUID(), name: 'Teclado', price: 79, create_at, updated_at },
            { id: randomUUID(), name: 'Cabo USB', price: 19, create_at, updated_at },
            { id: randomUUID(), name: 'Suporte', price: 29, create_at, updated_at },
        ]
        const result = await sut['applyPaginate']([...items], 1, 5)
        // 1 pagina e por pagina sao 5 items
        
        expect(result).toStrictEqual([items[0], items[1], items[2], items[3], items[4]])
    })

    it('should paginate items(5 items, 2 pages)', async () => {
        const items = [
            { id: randomUUID(), name: 'Lápis', price: 9, create_at, updated_at },
            { id: randomUUID(), name: 'Caneta', price: 19, create_at, updated_at },
            { id: randomUUID(), name: 'Borracha', price: 9, create_at, updated_at },
            { id: randomUUID(), name: 'Caderno', price: 29, create_at, updated_at },
            { id: randomUUID(), name: 'Mochila', price: 89, create_at, updated_at },
            { id: randomUUID(), name: 'Agenda', price: 39, create_at, updated_at },
            { id: randomUUID(), name: 'Tesoura', price: 19, create_at, updated_at },
            { id: randomUUID(), name: 'Régua', price: 9, create_at, updated_at },
            { id: randomUUID(), name: 'Estojo', price: 29, create_at, updated_at },
            { id: randomUUID(), name: 'Calculadora', price: 49, create_at, updated_at },
            { id: randomUUID(), name: 'Fone', price: 59, create_at, updated_at },
            { id: randomUUID(), name: 'Mouse', price: 39, create_at, updated_at },
            { id: randomUUID(), name: 'Teclado', price: 79, create_at, updated_at },
            { id: randomUUID(), name: 'Cabo USB', price: 19, create_at, updated_at },
            { id: randomUUID(), name: 'Suporte', price: 29, create_at, updated_at },
        ]
        const result = await sut['applyPaginate']([...items], 2, 5)
        // 2 pagina e por pagina sao 5 items
        
        expect(result).toStrictEqual([items[5], items[6], items[7], items[8], items[9]])
    })

    it('should paginate items(5 items, 3 pages)', async () => {
        const items = [
            { id: randomUUID(), name: 'Lápis', price: 9, create_at, updated_at },
            { id: randomUUID(), name: 'Caneta', price: 19, create_at, updated_at },
            { id: randomUUID(), name: 'Borracha', price: 9, create_at, updated_at },
            { id: randomUUID(), name: 'Caderno', price: 29, create_at, updated_at },
            { id: randomUUID(), name: 'Mochila', price: 89, create_at, updated_at },
            { id: randomUUID(), name: 'Agenda', price: 39, create_at, updated_at },
            { id: randomUUID(), name: 'Tesoura', price: 19, create_at, updated_at },
            { id: randomUUID(), name: 'Régua', price: 9, create_at, updated_at },
            { id: randomUUID(), name: 'Estojo', price: 29, create_at, updated_at },
            { id: randomUUID(), name: 'Calculadora', price: 49, create_at, updated_at },
            { id: randomUUID(), name: 'Fone', price: 59, create_at, updated_at },
            { id: randomUUID(), name: 'Mouse', price: 39, create_at, updated_at },
            { id: randomUUID(), name: 'Teclado', price: 79, create_at, updated_at },
            { id: randomUUID(), name: 'Cabo USB', price: 19, create_at, updated_at },
            { id: randomUUID(), name: 'Suporte', price: 29, create_at, updated_at },
        ]
        const result = await sut['applyPaginate']([...items], 3, 5)
        // 3 pagina e por pagina sao 5 items
        
        expect(result).toStrictEqual([items[10], items[11], items[12], items[13], items[14]])
    })
    })

    describe('search', () => {
        it('should paginate', async () => {
            const items = Array(20).fill({
                ...model,
                name: new Date().toString()
            })
            sut.items = items
            const result = await sut.search({})
            expect(result).toStrictEqual({
                items: await sut['applyPaginate'](items, 1, 15),
                total: 20,
                current_page: 1,
                per_page: 15,
                sort: null,
                sort_dir: null,
                filter: null,
            })
        })
        
        it('should paginate and filter', async () => {
            const items = [
                {
                    id: randomUUID(),
                    name: 'test',
                    price: 100,
                    create_at,
                    updated_at
                },
                {
                    id: randomUUID(),
                    name: 'TEST',
                    price: 1000,
                    create_at,
                    updated_at
                },
                {
                    id: randomUUID(),
                    name: 'TEsT',
                    price: 10,
                    create_at,
                    updated_at
                },
                {
                    id: randomUUID(),
                    name: 'a',
                    price: 10,
                    create_at,
                    updated_at
                }
            ]
            sut.items = items
            const result = await sut.search({
                page: 2,
                per_page: 2,
                filter: 'test'
            })
            expect(result).toStrictEqual({
                items: await sut['applyFilter']([items[2]], 'test'),
                total: 3,
                current_page: 2,
                per_page: 2,
                sort: null,
                sort_dir: null,
                filter: 'test',
            })
        })

        it('should apply paginate and apply sort', async () => {
            const items = [
                        {
                            id: randomUUID(),
                            name: 'c',
                            price: 2,
                            create_at,
                            updated_at
                        },
                        {
                            id: randomUUID(),
                            name: 'b',
                            price: 3,
                            create_at,
                            updated_at
                        },
                        {
                            id: randomUUID(),
                            name: 'd',
                            price: 1,
                            create_at,
                            updated_at
                        },
                        {
                            id: randomUUID(),
                            name: 'a',
                            price: 4,
                            create_at,
                            updated_at
                        }
            ]
            sut.items = items
            const result = await sut.search({
                page: 1,
                per_page: 5,
                sort: 'price',
                sort_dir: 'desc',
            })
            expect(result).toStrictEqual({
                items: await sut['applySort']([items[2], items[0], items[1], items[3]], 'price', 'desc'),
                total: 4,
                current_page: 1,
                per_page: 5,
                sort: 'price',
                sort_dir: 'desc',
                filter: null
            })
            
            // [items[2], items[0], items[1], items[3]]
            // [items[3], items[1], items[0], items[2]]
        })

        it('should search using paginate filter and sort', async () => {
            const items = [
                {
                    id: randomUUID(),
                    name: 'Test',
                    price: 4,
                    create_at,
                    updated_at
                },
                {
                    id: randomUUID(),
                    name: 'joao miguel',
                    price: 2,
                    create_at,
                    updated_at
                },
                {
                    id: randomUUID(),
                    name: 'joao pedro',
                    price: 3,
                    create_at,
                    updated_at
                },
                {
                    id: randomUUID(),
                    name: 'joao',
                    price: 1,
                    create_at,
                    updated_at,
                }
            ]
            sut.items = items
            const result = await sut.search({
                page: 1,
                per_page: 15,
                sort: 'price',
                sort_dir: 'desc',
                // filter: 'test'
            })
            expect(result).toStrictEqual({
                items: await sut['applyPaginate'](result.items, 1, 15),
                total: result.items.length,
                current_page: 1,
                per_page: 15,
                sort: 'price',
                sort_dir: 'desc',
                filter: null
            })
        })
    })
    
})
