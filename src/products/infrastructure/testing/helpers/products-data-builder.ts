
import ProductModel from "@/products/domain/models/products.model.ts";
import { faker } from '@faker-js/faker'
import { randomUUID } from "node:crypto";

async function ProductsDataBuilder(props: Partial<ProductModel>):Promise<ProductModel> {
    return {
        id: props.id ?? randomUUID(),
        name: props.name ?? faker.commerce.productName(),
        price: props.price ?? Number(faker.commerce.price({
            min: 99.90,
            max: 1999.90,
            dec: 2
        })),
        quantity: props.quantity ?? 10,
        created_at: props.created_at ?? new Date(),
        updated_at: props.updated_at ?? new Date(),
    }
}

export default ProductsDataBuilder
