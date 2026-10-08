
import { UsersTypeormRepository } from "@/users/infrastructure/typeorm/repositories/users-typeorm.repository"
import { UserOutput } from "../dtos/user-output.dto"
import { inject, injectable } from "tsyringe"
import BadRequestError from "@/common/domain/errors/bad-request-error"

export namespace GetUserUseCase {

    export type Input = {
        id: string
    }

    export type Output = UserOutput

    @injectable()
    export class UseCase {

        constructor(
            @inject('UsersRepository')
            private usersRepository: UsersTypeormRepository
        ) {}

        async execute(input: Input): Promise<Output> {
            
            if(!input.id) throw new BadRequestError('Input not provided or invalid')

            return this.usersRepository.findById(input.id)

        }

    }

}
