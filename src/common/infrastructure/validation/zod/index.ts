
import AppError from "@/common/domain/errors/app-errors.ts"
import z from "zod"

/**
 * @param schema objeto com schema de validation para o Zod
 * @param data objeto com os dados a serem validados
 * @returns retorna os dados validados
 */
async function dataValidation(schema: any, data: any) {
    const validData = schema.safeParse(data)
    if(!validData.success) {
        console.error('Invalid data: ', validData.error)
        throw new AppError('Invalid data')
    }

    return validData.data
}

export default dataValidation
