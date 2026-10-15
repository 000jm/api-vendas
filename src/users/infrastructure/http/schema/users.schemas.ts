
import z from "zod"

export const CreateUserSchema = z.object({
    name: z.string(),
    password: z.string(),
    email: z.string()
})

export const GetUserSchema = z.object({
    id: z.string()
})

export const SearchUserSchema = z.object({
    page: z.number().optional(),
    per_page: z.number().optional(),
    sort: z.string().optional(),
    sort_dir: z.string().optional(),
    filter: z.string().optional()
})

export const AuthenticateUserSchema = z.object({
    // email: z.email(),
    email: z.string(),
    password: z.string()
})

export const UpdateUserAvatarBodySchema = z.object({
    user_id: z.string().uuid()
})

export const UpdateUserAvatarFileSchema = z.any().refine(file => {
    return !! file
}, 'File is required')

export const SendEmailToResetPasswordSchema = z.object({
    email: z.string().email()
})

export const ResetPasswordSchema = z.object({
    token: z.string().uuid(),
    password: z.string()
})

export const UpdateUserBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    old_password: z.string().optional(),
    password: z.string().optional()
}).refine((data) => {

    if(data.password && !data.old_password) {
        return false
    }

    return true
    
}, {
    message: 'Old password is required',
    path: ['old_password']
})
