
import dataSource from "@/common/infrastructure/typeorm/index.ts"
import { container } from "tsyringe"
import { User } from "../typeorm/entities/users.entity.ts"
import { UsersTypeormRepository } from "../typeorm/repositories/users-typeorm.repository.ts"
import { CreateUserUseCase } from "@/users/application/usecases/create-user.usecase.ts"
import { GetUserUseCase } from "@/users/application/usecases/get-user.usecase.ts"
import { SearchUserUseCase } from "@/users/application/usecases/search-user.usecase.ts"


container.registerSingleton('UsersRepository', UsersTypeormRepository)
container.registerInstance('UsersDefaultRepository', dataSource.getRepository(User))

container.registerSingleton('CreateUserUseCase', CreateUserUseCase.UseCase)

container.registerSingleton('GetUserUseCase', GetUserUseCase.UseCase)

container.registerSingleton('SearchUserUseCase', SearchUserUseCase.UseCase)
