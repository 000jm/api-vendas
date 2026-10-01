
import ConflictError from "@/common/domain/errors/conflict-error.ts"
import NotFoundError from "@/common/domain/errors/not-found-error.ts"
import InMemoryRepository from "@/common/domain/repository/in-memory.repository.ts"
import ProductModel from "@/products/domain/models/products.model.ts"
import { ProductId, ProductsRepository } from "@/products/domain/repositories/product.repository.ts"

class ProductsInMemoryRepository extends InMemoryRepository<ProductModel> implements ProductsRepository {
    
    sortableFields: string[] = []
    items: ProductModel[] = []

    async findByName(name: string): Promise<ProductModel> {
        const product = this.items.find(item => item.name.toLowerCase() === name.toLowerCase())
        if(!product) {
            throw new NotFoundError(`Product not found with name: ${name}`)
        }

        return product
    }

    async findByAllIds(productsIds: ProductId[]): Promise<ProductModel[]> {
        const exitingProducts = []

        const ids = productsIds.map(productId => productId.id)

        const hasDuplicate = new Set(ids).size !== ids.length
        if(hasDuplicate) {
            throw new ConflictError('Only diferent ids')
        }

        for(const ProductId of productsIds) {
            const product = this.items.find(item => item.id === ProductId.id)
            
            if(!product) {
                new NotFoundError('Product not found')
            }

            exitingProducts.push(product)
        }

        return exitingProducts
    }

    async conflictingName(name: string): Promise<void> {
        const product = this.items.find(item => item.name === name)
        if(product) {
            throw new ConflictError(`Name already exists: ${name}`)
        }
    }
    
    protected async applyFilter(items: ProductModel[], filter: string | null): Promise<ProductModel[]> {
        if(!filter) return items

        const product = this.items.filter((item) => item.name.toLowerCase().includes(filter.toLowerCase()))
        if(product.length === 0) {
            throw new NotFoundError(`Product not found with name: ${filter}`)
        }

        return product
    }

    protected async applySort(items: ProductModel[], sort?: string | null, sort_dir?: string | null): Promise<ProductModel[]> {
        if(!sort || !this.sortableFields.includes(sort)) {
            return super.applySort(items, sort ?? 'created_at', sort_dir ?? 'asc')
        }

        return super.applySort(items, sort, sort_dir)
    }
}

export default ProductsInMemoryRepository
