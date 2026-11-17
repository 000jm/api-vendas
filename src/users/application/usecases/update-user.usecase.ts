import BadRequestError from '@/common/domain/errors/bad-request-error'
import type { HashProvider } from '@/common/domain/providers/hash-provider'
import type { UsersRepository } from '@/users/domain/repositories/users.repository'
import { inject, injectable } from 'tsyringe'
import type { UserOutput } from '../dtos/user-output.dto'

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

            const { user_id, name, old_password, password } = input
            const email = input.email.trim().toLowerCase()

            const user = await this.usersRepository.findById(user_id)

            if (user.email !== email) {
                await this.usersRepository.conflictingEmail(email)
                user.email = email
            }

            if (!old_password && password) {
                throw new BadRequestError('Informe a senha atual para alterar a senha')
            }

            if (old_password && password) {
                const oldPasswordMatches = await this.hashProvider.compareHash(old_password, user.password)

                if (!oldPasswordMatches) {
                    throw new BadRequestError('Senha atual incorreta')
                }

                user.password = await this.hashProvider.generateHash(password)
            }

            const normalizedName = name.trim()

            if (user.name !== normalizedName) {
                user.name = normalizedName
            }

            return this.usersRepository.update(user)

        }

    }

}
