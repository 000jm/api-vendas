import { UnauthorizedError } from '@/common/domain/errors/unauthorized-error'
import type { AuthProvider } from '@/common/domain/providers/auth-provider'
import type { NextFunction, Request, Response } from 'express'
import { container } from 'tsyringe'

export function isAuthenticatedHandler(req: Request, _res: Response, next: NextFunction): void {

    const authHeader = req.headers.authorization

    if (!authHeader) {
        throw new UnauthorizedError('Token de acesso não informado')
    }

    const [scheme, token] = authHeader.split(' ')

    if (scheme !== 'Bearer' || !token) {
        throw new UnauthorizedError('Token de acesso inválido')
    }

    const authProvider: AuthProvider = container.resolve('JwtAuthProvider')
    const { user_id } = authProvider.verifyAuthKey(token)

    req.user = { id: user_id }

    return next()

}
