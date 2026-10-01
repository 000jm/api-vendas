
import { RepositoryInterface } from "@/common/domain/repository/repository.interface.ts";
import ProductModel from "../models/products.model.ts";

export type ProductId = {
    id: string
}

export type CreateProductProps = {
    id?: string
    name: string
    price: number
    quantity: number
    created_at?: Date
    updated_at?: Date
}

export interface ProductsRepository extends RepositoryInterface<ProductModel, CreateProductProps> {
    findByName(name: string):Promise<ProductModel>
    findByAllIds(productsIds: ProductId[]):Promise<ProductModel[]>
    conflictingName(name: string):Promise<void>
}
