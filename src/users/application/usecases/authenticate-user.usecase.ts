
import { inject, injectable } from "tsyringe"
import { UserOutput } from "../dtos/user-output.dto"
import type { UsersRepository } from "@/users/domain/repositories/users.repository"
import type { HashProvider } from "@/common/domain/providers/hash-provider"
import { InvalidCredentialsError } from "@/common/domain/errors/invalid-credetials-error"

export namespace AuthenticateUserUseCase {

    export type Input = {
        email: string
        password: string
    }

    export type Output = UserOutput

    @injectable()
    export class UseCase {
        
        constructor(
            @inject('UsersRepository')
            private usersRepository: UsersRepository,
            @inject('HashProvider')
            private hashProvider: HashProvider
        ) {}

        async execute(input: Input): Promise<Output> {
            if(!input.email || !input.password) throw new InvalidCredentialsError('Invaid credetials')

            const user = await this.usersRepository.findByEmail(input.email)
            if(!user) throw new InvalidCredentialsError('Invalid credetials')
 
            const passwordMatch: boolean = await this.hashProvider.compareHash(input.password, user.password)
            if(!passwordMatch) throw new InvalidCredentialsError('Invalid credetials')

            return user
        }

    }

}
