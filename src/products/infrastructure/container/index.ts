
import ProductsTypeormRepository from "@/products/infrastructure/typeorm/repositories/products-typeorm.repository.ts"
import dataSource from "@/common/infrastructure/typeorm/index.ts"
import Product from "@/products/infrastructure/typeorm/entities/products.entity.ts"
import { container } from "tsyringe"
import CreateProductUseCase from "@/products/application/usecases/create/create-product.usecase.ts"
import GetProductUseCase from "@/products/application/usecases/get/get-product.usecase.ts"
import UpdateProductUseCase from "@/products/application/usecases/update/update-product.usecase"

container.registerSingleton('ProductRepository', ProductsTypeormRepository)
container.registerInstance('ProductsDefaultTypeormRepository', dataSource.getRepository(Product))

container.registerSingleton('CreateProductUseCase', CreateProductUseCase.UseCase)

container.registerSingleton('GetProductUseCase', GetProductUseCase.UseCase)

container.registerSingleton('UpdateProductUseCase', UpdateProductUseCase.UseCase)
