import 'dotenv/config'
import AppError from '@/common/domain/errors/app-errors'
import z from 'zod'

const envSchema = z.object({

    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().default(3000),
    API_URL: z.string().url().default('http://localhost:3000'),
    FRONTEND_URL: z.string().url().default('http://localhost:5173'),
    CORS_ORIGINS: z.string().default('http://localhost:3000,http://localhost:5173'),

    DB_TYPE: z.string().default('postgres'),
    DB_HOST: z.string().default('localhost'),
    DB_PORT: z.coerce.number().default(5432),
    DB_SCHEMA: z.string().default('public'),
    DB_NAME: z.string().default('postgres'),
    DB_USER: z.string().default('postgres'),
    DB_PASSWORD: z.string().default('postgres'),

    JWT_SECRET: z.string().min(1, 'JWT_SECRET é obrigatório'),
    JWT_EXPIRES_IN: z.coerce.number().default(86400),

    STORAGE_DRIVER: z.enum(['local', 'supabase']).default('local'),
    SUPABASE_PROJECT_ID: z.string().optional(),
    SUPABASE_STORAGE_URL: z.string().url().optional(),
    SUPABASE_STORAGE_PUBLIC_URL: z.string().url().optional(),
    BUCKET_NAME: z.string().optional(),
    AWS_ACCESS_KEY_ID: z.string().optional(),
    AWS_SECRET_ACCESS_KEY: z.string().optional(),

    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z.coerce.number().default(587),
    SMTP_USER: z.string().optional(),
    SMTP_PASS: z.string().optional(),
    MAIL_FROM_EMAIL: z.string().email().default('nao-responda@apivendas.com'),
    MAIL_FROM_NAME: z.string().default('API Vendas')

}).superRefine((data, ctx) => {

    if (data.STORAGE_DRIVER !== 'supabase') return

    const required = [
        'SUPABASE_STORAGE_URL',
        'SUPABASE_STORAGE_PUBLIC_URL',
        'BUCKET_NAME',
        'AWS_ACCESS_KEY_ID',
        'AWS_SECRET_ACCESS_KEY',
    ] as const

    for (const key of required) {
        if (!data[key]) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: [key],
                message: `${key} é obrigatório quando STORAGE_DRIVER=supabase`,
            })
        }
    }

})

const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
    console.error('Variáveis de ambiente inválidas:', parsedEnv.error.format())
    throw new AppError('Variáveis de ambiente inválidas')
}

export const env = parsedEnv.data
