import z from 'zod'

export const createProductSchema = z.object({
    name: z.string().trim().min(1, 'Nome é obrigatório'),
    price: z.coerce.number().positive('O preço deve ser maior que zero'),
    quantity: z.coerce.number().int('A quantidade deve ser um número inteiro').positive('A quantidade deve ser maior que zero')
})

export const deleteProductSchema = z.object({
    id: z.string().uuid('ID inválido')
})

export const getProductSchema = z.object({
    id: z.string().uuid('ID inválido')
})

export const searchProductSchema = z.object({
    page: z.coerce.number().int().positive('Página inválida').optional(),
    per_page: z.coerce.number().int().positive('Itens por página inválido').max(100, 'Máximo de 100 itens por página').optional(),
    sort: z.string().optional(),
    sort_dir: z.enum(['asc', 'desc'], { message: 'Direção de ordenação inválida' }).optional(),
    filter: z.string().optional()
})

export const updateProductIdSchema = z.object({
    id: z.string().uuid('ID inválido'),
})

export const updateProductSchema = z.object({
    name: z.string().trim().min(1, 'Nome é obrigatório').optional(),
    price: z.coerce.number().positive('O preço deve ser maior que zero').optional(),
    quantity: z.coerce.number().int('A quantidade deve ser um número inteiro').positive('A quantidade deve ser maior que zero').optional(),
}).refine(data => data.name !== undefined || data.price !== undefined || data.quantity !== undefined, {
    message: 'Informe ao menos um campo para atualizar'
})
