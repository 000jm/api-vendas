
import BadRequestError from "@/common/domain/errors/bad-request-error.ts"
import z from "zod"

export async function usersDataValidation(schema: any, data: any) {
    const validData = z.safeParse(schema, data)
    if(!validData.success) throw new BadRequestError(`Error: ${validData.error}`)

    return validData.data
}
