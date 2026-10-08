
import type { ProductsRepository } from "@/products/domain/repositories/product.repository.ts"
import { inject, injectable } from "tsyringe"
import ProductModel from "@/products/domain/models/products.model.ts"
import { PaginationOutputDto, PaginationOutputMapper } from "../dtos/search-output.dto.ts"
import { SearchInput } from "@/common/domain/repository/repository.interface.ts"

namespace SearchProductUseCase {

    export type Input = SearchInput

    export type Output = PaginationOutputDto<ProductModel>

    @injectable()
    export class UseCase {
        constructor(
            @inject('ProductRepository') 
            private productsRepository: ProductsRepository,
        ) {}

        async execute(input: Input): Promise<Output> {
            const searchResult = await this.productsRepository.search(input)

            return PaginationOutputMapper.toOutput(searchResult.items, searchResult)
        }
    }

}

export default SearchProductUseCase
