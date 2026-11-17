import { InvalidCredentialsError } from '@/common/domain/errors/invalid-credentials-error'
import NotFoundError from '@/common/domain/errors/not-found-error'
import type { HashProvider } from '@/common/domain/providers/hash-provider'
import type { UsersRepository } from '@/users/domain/repositories/users.repository'
import { inject, injectable } from 'tsyringe'
import type { UserOutput } from '../dtos/user-output.dto'

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

            if (!input.email || !input.password) {
                throw new InvalidCredentialsError()
            }

            const email = input.email.trim().toLowerCase()

            let user
            try {
                user = await this.usersRepository.findByEmail(email)
            } catch (error) {
                if (error instanceof NotFoundError) {
                    throw new InvalidCredentialsError()
                }
                throw error
            }

            const passwordMatch = await this.hashProvider.compareHash(input.password, user.password)

            if (!passwordMatch) {
                throw new InvalidCredentialsError()
            }

            return user

        }

    }

}
