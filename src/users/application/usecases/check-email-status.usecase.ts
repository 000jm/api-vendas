import { inject, injectable } from 'tsyringe'
import type { UsersRepository } from '@/users/domain/repositories/users.repository'

export namespace CheckEmailStatusUseCase {
  export type Input = { email: string }
  export type Output = { exists: boolean }

  @injectable()
  export class UseCase {
    constructor(
      @inject('UsersRepository')
      private usersRepository: UsersRepository,
    ) {}

    async execute(input: Input): Promise<Output> {
      return { exists: await this.usersRepository.emailExists(input.email) }
    }
  }
}
