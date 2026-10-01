
import ProductModel from "@/products/domain/models/products.model.ts"
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('products')
class Product implements ProductModel {
    @PrimaryGeneratedColumn('uuid')
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
