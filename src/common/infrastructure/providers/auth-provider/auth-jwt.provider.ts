
import { AuthProvider, GenerateAuthKeyProps, VerifyAuthKeyProps } from "@/common/domain/providers/auth-provider.ts"
import jwt from 'jsonwebtoken'
import { env } from "../../env"
import { InvalidCredentialsError } from "@/common/domain/errors/invalid-credetials-error"
import { injectable } from "tsyringe"

export type DecodedTokenProps = {
    sub: string
}

@injectable()
export class JwtAuthProvider implements AuthProvider {
    generateAuthKey(user_id: string): GenerateAuthKeyProps {

        const acess_token = jwt.sign({}, env.JWT_SECRET, {
            expiresIn: env.JWT_EXPIRES_IN,
            subject: user_id
        })

        return { acess_token }

    }
    verifyAuthKey(token: string): VerifyAuthKeyProps {
        
        try {
            const decodedToken = jwt.verify(token, env.JWT_SECRET)
            const { sub } = decodedToken as DecodedTokenProps

            return { user_id: sub }
        } catch {
            throw new InvalidCredentialsError('Invalid credentials')
        }

    }
}
