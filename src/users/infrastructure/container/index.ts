
import dataSource from "@/common/infrastructure/typeorm"
import { container } from "tsyringe"
import { User } from "../typeorm/entities/users.entity"
import { UsersTypeormRepository } from "../typeorm/repositories/users-typeorm.repository"

container.registerInstance('UsersTypeormRepository', UsersTypeormRepository)
container.registerInstance('UsersDefaultTypeormRepository', dataSource.getRepository(User))
