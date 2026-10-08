
import z from "zod"

export const CreateUserSchema = z.object({
    name: z.string(),
    password: z.string(),
    email: z.string()
})

export const GetUserSchema = z.object({
    id: z.string()
})

export const searchUserSchema = z.object({
    page: z.number().optional(),
    per_page: z.number().optional(),
    sort: z.string().optional(),
    sort_dir: z.string().optional(),
    filter: z.string().optional()
})
