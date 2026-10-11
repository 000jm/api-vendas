
import { RepositoryInterface } from "@/common/domain/repository/repository.interface";
import { UserModel } from "../models/user.model";

export type CreateUserProps = {
    name: string
    password: string
    email: string
}

export interface UsersRepository extends RepositoryInterface<UserModel, CreateUserProps> {
    findByEmail(email: string): Promise<UserModel>
    findByName(name: string): Promise<UserModel>
    conflictingEmail(email: string): Promise<void>
}
