import type { SearchInput, SearchOutput } from '@/common/domain/repository/repository.interface'
import BadRequestError from '@/common/domain/errors/bad-request-error'
import ConflictError from '@/common/domain/errors/conflict-error'
import NotFoundError from '@/common/domain/errors/not-found-error'
import type ProductModel from '@/products/domain/models/products.model'
import type { CreateProductProps, ProductId, ProductsRepository } from '@/products/domain/repositories/product.repository'
import { inject, injectable } from 'tsyringe'
import { ILike, In, type Repository } from 'typeorm'
import Product from '../entities/products.entity'

@injectable()
class ProductsTypeormRepository implements ProductsRepository {

    sortableFields = ['name', 'created_at', 'price', 'quantity']

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
        return this._get(id)
    }

    async update(model: ProductModel): Promise<ProductModel> {
        const product = await this._get(model.id)

        if (model.name !== undefined && model.name !== product.name) {
            const productWithSameName = await this.productsRepository.findOneBy({ name: model.name })

            if (productWithSameName && productWithSameName.id !== model.id) {
                throw new ConflictError('Já existe um produto com esse nome')
            }
        }

        await this.productsRepository.update({ id: model.id }, {
            ...(model.name !== undefined && { name: model.name }),
            ...(model.price !== undefined && { price: model.price }),
            ...(model.quantity !== undefined && { quantity: model.quantity }),
        })

        return this._get(model.id)
    }

    async delete(id: string): Promise<void> {
        await this._get(id)
        await this.productsRepository.delete({ id })
    }

    async search(props: SearchInput): Promise<SearchOutput<ProductModel>> {
        const page = props.page ?? 1
        const perPage = props.per_page ?? 15
        const sort = props.sort && this.sortableFields.includes(props.sort) ? props.sort : 'created_at'
        const sortDir = props.sort_dir === 'asc' || props.sort_dir === 'desc' ? props.sort_dir : 'desc'

        if (props.sort_dir && props.sort_dir !== 'asc' && props.sort_dir !== 'desc') {
            throw new BadRequestError('Direção de ordenação inválida. Use "asc" ou "desc"')
        }

        const [products, total] = await this.productsRepository.findAndCount({
            ...(props.filter && {
                where: {
                    name: ILike(`%${props.filter}%`)
                }
            }),
            order: { [sort]: sortDir },
            skip: (page - 1) * perPage,
            take: perPage,
        })

        return {
            items: products,
            per_page: perPage,
            total,
            current_page: page,
            sort,
            sort_dir: sortDir,
            filter: props.filter ?? null
        }
    }

    async findByName(name: string): Promise<ProductModel> {
        const product = await this.productsRepository.findOneBy({ name })

        if (!product) {
            throw new NotFoundError('Produto não encontrado')
        }

        return product
    }

    async conflictingName(name: string): Promise<void> {
        const product = await this.productsRepository.findOneBy({ name })

        if (product) {
            throw new ConflictError('Já existe um produto com esse nome')
        }
    }

    async findByAllIds(productsIds: ProductId[]): Promise<ProductModel[]> {
        const ids = productsIds.map(productId => productId.id)

        return this.productsRepository.find({ where: { id: In(ids) } })
    }

    private async _get(id: string): Promise<ProductModel> {
        const product = await this.productsRepository.findOneBy({ id })

        if (!product) {
            throw new NotFoundError('Produto não encontrado')
        }

        return product
    }

}

export default ProductsTypeormRepository
