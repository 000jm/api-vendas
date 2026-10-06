
import { SearchInput, SearchOutput } from "@/common/domain/repository/repository.interface.ts"
import ProductModel from "@/products/domain/models/products.model.ts"
import { CreateProductProps, ProductId, ProductsRepository } from "@/products/domain/repositories/product.repository.ts"
import Product from "../entities/products.entity.ts"
import { In, Repository } from "typeorm"
import NotFoundError from "@/common/domain/errors/not-found-error.ts"
import ConflictError from "@/common/domain/errors/conflict-error.ts"
import { inject, injectable } from "tsyringe"

@injectable()
class ProductsTypeormRepository implements ProductsRepository {
    sortableFields:string[] = ['name', 'created_at', 'price']

    constructor(
        @inject('ProductsDefaultTypeormRepository')
        private productsRepository: Repository<Product>
    ) {}
    
    create(props: CreateProductProps): ProductModel {
        return this.productsRepository.create(props)
    }
    
    insert(model: ProductModel): Promise<ProductModel> {
        return this.productsRepository.save(model)
    }

    async findById(id: string): Promise<ProductModel> {
        const product = await this._get(id)

        return product
    }

    async update(model: ProductModel): Promise<ProductModel> {
        const validProduct = await this._get(model.id)
        const updated_at = new Date()
        const updatedProduct = {
            id: validProduct.id,
            ...(model.name !== undefined && {name: model.name}),
            ...(model.price !== undefined && {price: model.price}),
            ...(model.quantity !== undefined && {quantity: model.quantity}),
            updated_at,
        }
        if(model.name === validProduct.name) await this.conflictingName(model.name)
        await this.productsRepository.update({ id: model.id }, updatedProduct)
        
        return updatedProduct
    }

    async delete(id: string): Promise<void> {
        await this._get(id)
        await this.productsRepository.delete({ id })
    }

    async search(props: SearchInput): Promise<SearchOutput<ProductModel>> {
        const validSort: boolean = this.sortableFields.includes(props.sort) || false
        const dirOps = ['asc', 'desc']
        const validSortDir: boolean = (props.sort_dir && dirOps.includes(props.sort_dir)) || false

        const orderByField: string = validSort ? props.sort : 'created_at'
        const orderByDir: string = validSortDir ? props.sort_dir : 'desc'
 
        if(!props.page) props.page = 1
        if(!props.per_page) props.per_page = 10

        const [products, total] = await this.productsRepository.findAndCount({
            ...(props.filter && {where: { name: props.filter.toLowerCase() }}),
            order: { [orderByField]: orderByDir },
            skip: (props.page - 1) * props.per_page,
            take: props.per_page,
        })

        return {
            items: products,
            per_page: props.per_page,
            total,
            current_page: props.page,
            sort: orderByField,
            sort_dir: orderByDir,
            filter: props.filter
        }
    }

    async findByName(name: string): Promise<ProductModel> {
        const product = await this.productsRepository.findOneBy({ name })
        if(!product) {
            throw new NotFoundError(`Product not found with name: ${name}`)
        }
        return product
    }
    
    async conflictingName(name: string): Promise<void> {
        const product = await this.productsRepository.findOneBy({ name })
        if(product) {
            throw new ConflictError(`Product name ${name} already in use`)
        }
    }

    async findByAllIds(productsIds: ProductId[]): Promise<ProductModel[]> {
        const ids = productsIds.map(productId => productId.id)
        const products = await this.productsRepository.find({ where: { id: In(ids) } })
        if(!products) {
            throw new NotFoundError('Products not found')
        }
        // nao precisa porque ele retorna array de length 0/sem produtos

        return products
    }

    protected async _get(id: string): Promise<ProductModel> {
        const product = await this.productsRepository.findOneBy({ id })
        // se fosse outro parametro indicando id teria que ser id: (parametro)
        if(!product) {
            throw new NotFoundError(`Product not found with id: ${id}`)
        }

        return product
    }

}

export default ProductsTypeormRepository
