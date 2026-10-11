
import { inject, injectable } from "tsyringe"
import { UserOutput } from "../dtos/user-output.dto"
import BadRequestError from "@/common/domain/errors/bad-request-error"
import type { HashProvider } from "@/common/domain/providers/hash-provider"
import type { UsersRepository } from "@/users/domain/repositories/users.repository"

export namespace CreateUserUseCase {
    
    export type Input = {
        name: string
        password: string 
        email: string
        avatar?: string
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
            
            if(!input.name || !input.password || !input.email) throw new BadRequestError('Input data not provided or invalid')
                
            await this.usersRepository.conflictingEmail(input.email)
            
            const hashedPassword = await this.hashProvider.generateHash(input.password)

            const user = this.usersRepository.create(input)
            // user.password = hashedPassword
            Object.assign(user, { password: hashedPassword })

            return this.usersRepository.insert(user)
            // return await this.usersRepository.insert(user)

        }
    }

}
