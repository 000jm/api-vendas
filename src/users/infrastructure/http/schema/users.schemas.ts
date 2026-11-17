import z from 'zod'

const emailSchema = z.string().trim().toLowerCase().email('E-mail inválido')
const passwordSchema = z.string().min(6, 'A senha deve ter no mínimo 6 caracteres')

export const CreateUserSchema = z.object({
    name: z.string().trim().min(1, 'Nome é obrigatório'),
    email: emailSchema,
    password: passwordSchema
})

export const GetUserSchema = z.object({
    id: z.string().uuid('ID inválido')
})

export const SearchUserSchema = z.object({
    page: z.coerce.number().int().positive('Página inválida').optional(),
    per_page: z.coerce.number().int().positive('Itens por página inválido').max(100, 'Máximo de 100 itens por página').optional(),
    sort: z.string().optional(),
    sort_dir: z.enum(['asc', 'desc'], { message: 'Direção de ordenação inválida' }).optional(),
    filter: z.string().optional()
})

export const AuthenticateUserSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, 'Senha é obrigatória')
})

export const UpdateUserAvatarFileSchema = z.any().refine(file => !!file, {
    message: 'Envie uma imagem'
})

export const SendEmailToResetPasswordSchema = z.object({
    email: emailSchema
})

export const ResetPasswordSchema = z.object({
    token: z.string().uuid('Token inválido'),
    password: passwordSchema
})

export const UpdateUserBodySchema = z.object({
    name: z.string().trim().min(1, 'Nome é obrigatório'),
    email: emailSchema,
    old_password: z.string().optional(),
    password: z.string().min(6, 'A nova senha deve ter no mínimo 6 caracteres').optional()
}).refine(data => !data.password || !!data.old_password, {
    message: 'Informe a senha atual para alterar a senha',
    path: ['old_password']
})
