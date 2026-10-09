
import { inject, injectable } from "tsyringe"
import { UserOutput } from "../dtos/user-output.dto"
import type { UsersRepository } from "@/users/domain/repositories/users.repository"

export namespace UpdateUserUseCase {
    
    export type Input = {
        
    }

    export type Output = UserOutput

    @injectable()
    export class UseCase {
        constructor(
            @inject('UsersRepository')
            private usersRepository: UsersRepository,
        ) {}

        async execute(input: Input): Promise<Output> {
            return
        }
    }

}
