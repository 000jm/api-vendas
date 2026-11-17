import BadRequestError from '@/common/domain/errors/bad-request-error'
import type { HashProvider } from '@/common/domain/providers/hash-provider'
import type { UsersRepository } from '@/users/domain/repositories/users.repository'
import { inject, injectable } from 'tsyringe'
import type { UserOutput } from '../dtos/user-output.dto'

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

            if (!input.name || !input.password || !input.email) {
                throw new BadRequestError('Nome, e-mail e senha são obrigatórios')
            }

            const email = input.email.trim().toLowerCase()
            const name = input.name.trim()

            await this.usersRepository.conflictingEmail(email)

            const user = this.usersRepository.create({
                name,
                email,
                password: await this.hashProvider.generateHash(input.password)
            })

            return this.usersRepository.insert(user)

        }

    }

}
