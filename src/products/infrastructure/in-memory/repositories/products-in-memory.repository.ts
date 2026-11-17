import ConflictError from '@/common/domain/errors/conflict-error'
import NotFoundError from '@/common/domain/errors/not-found-error'
import InMemoryRepository from '@/common/domain/repository/in-memory.repository'
import type ProductModel from '@/products/domain/models/products.model'
import type { ProductId, ProductsRepository } from '@/products/domain/repositories/product.repository'

class ProductsInMemoryRepository extends InMemoryRepository<ProductModel> implements ProductsRepository {

    sortableFields: string[] = []
    items: ProductModel[] = []

    async findByName(name: string): Promise<ProductModel> {
        const product = this.items.find(item => item.name.toLowerCase() === name.toLowerCase())

        if (!product) {
            throw new NotFoundError('Produto não encontrado')
        }

        return product
    }

    async findByAllIds(productsIds: ProductId[]): Promise<ProductModel[]> {
        const ids = productsIds.map(productId => productId.id)

        if (new Set(ids).size !== ids.length) {
            throw new ConflictError('Informe IDs diferentes')
        }

        return productsIds.map(({ id }) => {
            const product = this.items.find(item => item.id === id)

            if (!product) {
                throw new NotFoundError('Produto não encontrado')
            }

            return product
        })
    }

    async conflictingName(name: string): Promise<void> {
        const product = this.items.find(item => item.name === name)

        if (product) {
            throw new ConflictError('Já existe um produto com esse nome')
        }
    }

    protected async applyFilter(items: ProductModel[], filter: string | null): Promise<ProductModel[]> {
        if (!filter) return items

        return items.filter(item => item.name.toLowerCase().includes(filter.toLowerCase()))
    }

    protected async applySort(items: ProductModel[], sort?: string | null, sort_dir?: string | null): Promise<ProductModel[]> {
        if (!sort || !this.sortableFields.includes(sort)) {
            return super.applySort(items, sort ?? 'created_at', sort_dir ?? 'asc')
        }

        return super.applySort(items, sort, sort_dir)
    }

}

export default ProductsInMemoryRepository
