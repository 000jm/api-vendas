
import ProductModel from "@/products/domain/models/products.model.ts"
import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity('products')
class Product implements ProductModel {
    @PrimaryColumn('uuid')
    id: string;
    
    @Column('varchar')
    name: string;
    
    @Column({
        type: 'decimal',
        transformer: {
            to: (value: number) => value,
            from: (value: string) => Number(value),
        },
    })
    
    price: number;
    
    @Column('int')
    quantity: number;

    @CreateDateColumn({name: 'created_at'})
    created_at: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updated_at: Date;
}

export default Product
