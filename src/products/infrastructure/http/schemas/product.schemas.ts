
import z from "zod"

export const createProductSchema = z.object({
    name: z.string(),
    price: z.number(),
    quantity: z.number()
})

export const deleteProductSchema = z.object({
    id: z.string()
})

export const getProductSchema = z.object({
    id: z.string()
})

export const searchProductSchema = z.object({
    page: z.number().optional(),
    per_page: z.number().optional(),
    sort: z.string().optional(),
    sort_dir: z.string().optional(),
    filter: z.string().optional()
})

export const updateProductIdSchema = z.object({
    id: z.string(),
})

export const updateProductSchema = z.object({
    name: z.string().optional(),
    price: z.number().optional(),
    quantity: z.number().optional(),
})
