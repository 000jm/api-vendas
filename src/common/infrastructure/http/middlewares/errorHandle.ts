import AppError from '@/common/domain/errors/app-errors'
import type { NextFunction, Request, Response } from 'express'
import { MulterError } from 'multer'

function errorHandle(err: any, _req: Request, res: Response, _next: NextFunction): Response {

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            statusCode: err.statusCode,
            message: err.message,
            ...(err.details ? { details: err.details } : {})
        })
    }

    if (err instanceof MulterError) {
        const message = err.code === 'LIMIT_FILE_SIZE'
            ? 'A imagem deve ter no máximo 3 MB'
            : 'Não foi possível enviar o arquivo'

        return res.status(400).json({
            status: 'error',
            statusCode: 400,
            message
        })
    }

    if (err?.type === 'entity.too.large') {
        return res.status(413).json({
            status: 'error',
            statusCode: 413,
            message: 'Conteúdo da requisição muito grande'
        })
    }

    if (err instanceof SyntaxError && 'body' in err) {
        return res.status(400).json({
            status: 'error',
            statusCode: 400,
            message: 'JSON inválido'
        })
    }

    if (err?.code === '23505') {
        return res.status(409).json({
            status: 'error',
            statusCode: 409,
            message: 'Registro já cadastrado'
        })
    }

    console.error(err)

    return res.status(500).json({
        status: 'error',
        statusCode: 500,
        message: 'Erro interno do servidor'
    })

}

export default errorHandle
