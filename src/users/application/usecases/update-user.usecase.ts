
import { inject, injectable } from "tsyringe"
import { UserOutput } from "../dtos/user-output.dto"
import { UsersTypeormRepository } from "@/users/infrastructure/typeorm/repositories/users-typeorm.repository"

export namespace UpdateUserUseCase {
    
    export type Input = {
        
    }

    export type Output = UserOutput

    @injectable()
    export class UseCase {
        constructor(
            @inject('UsersRepository')
            private usersRepository: UsersTypeormRepository,
        ) {}

        async execute(input: Input): Promise<Output> {
            return
        }
    }

}
