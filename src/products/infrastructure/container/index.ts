
import CreateProductUseCase from "@/products/application/usecases/create-product.usecase.ts"
import ProductsTypeormRepository from "@/products/infrastructure/typeorm/repositories/products-typeorm.repository.ts"
import Product from "@/products/infrastructure/typeorm/entities/products.entity.ts"
import { container } from "tsyringe"
import dataSource from "@/common/infrastructure/typeorm/index.ts"

container.registerSingleton('ProductRepository', ProductsTypeormRepository)
container.registerSingleton('CreateProductUseCase', CreateProductUseCase.UseCase)
container.registerInstance('ProductsDefaultTypeormRepository', dataSource.getRepository(Product))
