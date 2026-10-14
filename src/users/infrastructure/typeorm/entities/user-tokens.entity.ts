
import { UserTokensModel } from "@/users/domain/models/user-tokens.model";
import { Column, CreateDateColumn, Entity, Generated, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('user_tokens')
export class UserTokens implements UserTokensModel {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    @Generated('uuid')
    token: string

    @Column()
    user_id: string

    @CreateDateColumn()
    created_at: string

    @UpdateDateColumn()
    updated_at: string
}
