
import { container } from 'tsyringe'
import '@/products/infrastructure/container/index.ts'
import '@/users/infrastructure/container/index.ts'
import { BcryptjsHashProvider } from '../providers/hash-provider/bcryptjs-hash.provider'
import { JwtAuthProvider } from '../providers/auth-provider/auth-jwt.provider'

container.registerSingleton('HashProvider', BcryptjsHashProvider)

container.registerSingleton('JwtAuthProvider', JwtAuthProvider)
