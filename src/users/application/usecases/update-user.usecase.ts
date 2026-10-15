
import { inject, injectable } from "tsyringe"
import { UserOutput } from "../dtos/user-output.dto"
import type { UsersRepository } from "@/users/domain/repositories/users.repository"
import BadRequestError from "@/common/domain/errors/bad-request-error"
import type { HashProvider } from "@/common/domain/providers/hash-provider"

export namespace UpdateUserUseCase {
    
    export type Input = {
        user_id: string
        name: string
        email: string
        old_password?: string
        password?: string
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

            const { user_id, name, email, old_password, password } = input
            const user = await this.usersRepository.findById(user_id)

            if(user.email !== email) {
                await this.usersRepository.conflictingEmail(email)
                user.email = email
            }

            if(!old_password && password) {
                throw new BadRequestError('Old password is required to change password')
            }

            if(old_password && password) {
                const checkOldPassword = await this.hashProvider.compareHash(old_password, user.password)
                if(!checkOldPassword) {
                    throw new BadRequestError('Old password does not match')
                }
                user.password = await this.hashProvider.generateHash(password)
            }


            if(user.name !== name) {
                user.name = name
            }

            return this.usersRepository.update(user)
            
        }
        
    }

}
