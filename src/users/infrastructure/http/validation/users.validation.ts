import BadRequestError from '@/common/domain/errors/bad-request-error'
import type { ZodError, ZodType } from 'zod'

function formatZodError(error: ZodError) {
    return error.issues.map(issue => ({
        field: issue.path.join('.') || 'body',
        message: issue.message,
    }))
}

export async function usersDataValidation<T>(schema: ZodType<T>, data: unknown): Promise<T> {
    const validData = schema.safeParse(data)

    if (!validData.success) {
        throw new BadRequestError('Dados inválidos', formatZodError(validData.error))
    }

    return validData.data
}
