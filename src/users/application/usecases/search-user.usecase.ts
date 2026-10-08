
import { inject, injectable } from "tsyringe"
import { UsersTypeormRepository } from "@/users/infrastructure/typeorm/repositories/users-typeorm.repository"
import { SearchInput } from "@/common/domain/repository/repository.interface"
import { PaginationOutputDto, PaginationOutputMapper } from "@/products/application/usecases/dtos/search-output.dto"
import { UserModel } from "@/users/domain/models/user.model"

export namespace SearchUserUseCase {
    
    export type Input = SearchInput

    export type Output = PaginationOutputDto<UserModel>

    @injectable()
    export class UseCase {
        constructor(
            @inject('UsersRepository')
            private usersRepository: UsersTypeormRepository,
        ) {}

        async execute(input: Input): Promise<Output> {
            const searchResult = await this.usersRepository.search(input)

            return PaginationOutputMapper.toOutput(searchResult.items, searchResult)
          }
    }

}
