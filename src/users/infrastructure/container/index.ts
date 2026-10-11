
import dataSource from "@/common/infrastructure/typeorm/index.ts"
import { container } from "tsyringe"
import { User } from "../typeorm/entities/users.entity.ts"
import { UsersTypeormRepository } from "../typeorm/repositories/users-typeorm.repository.ts"
import { CreateUserUseCase } from "@/users/application/usecases/create-user.usecase.ts"
import { SearchUserUseCase } from "@/users/application/usecases/search-user.usecase.ts"
import { AuthenticateUserUseCase } from "@/users/application/usecases/authenticate-user.usecase.ts"
import { UpdateAvatarUseCase } from "@/users/application/usecases/update-avatar-user.usecase.ts"


container.registerSingleton('UsersRepository', UsersTypeormRepository)
container.registerInstance('UsersDefaultRepository', dataSource.getRepository(User))

container.registerSingleton('CreateUserUseCase', CreateUserUseCase.UseCase)

container.registerSingleton('SearchUserUseCase', SearchUserUseCase.UseCase)

container.registerSingleton('AuthenticateUserUseCase', AuthenticateUserUseCase.UseCase)

container.registerSingleton('UpdateAvatarUseCase', UpdateAvatarUseCase.UseCase)
