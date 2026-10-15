
import { UnathorizedError } from "@/common/domain/errors/unathorized-error"
import { AuthProvider } from "@/common/domain/providers/auth-provider"
import { NextFunction, Request, Response } from "express"
import { container } from "tsyringe"

export function isAuthenticatedHandler(req: Request, _res: Response, next: NextFunction): void {
    
    const authHeader = req.headers.authorization

    if(!authHeader) {
        throw new UnathorizedError('Token is missing')
    }

    const [, acess_token ] = authHeader.split(' ')
    // o acess_token poderia ser qualquer nome

    const authProvider: AuthProvider = container.resolve('JwtAuthProvider')

    const { user_id } = authProvider.verifyAuthKey(acess_token)

    if (!user_id) {
        throw new UnathorizedError('Invalid token')
    }

    req.user = {
        id: user_id
    }

    return next()

}
