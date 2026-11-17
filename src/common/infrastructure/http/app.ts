import { env } from '@/common/infrastructure/env'
import NotFoundError from '@/common/domain/errors/not-found-error'
import cors from 'cors'
import express from 'express'
import 'express-async-errors'
import path from 'node:path'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import errorHandle from './middlewares/errorHandle'
import routes from './routes/routes'

const allowedOrigins = env.CORS_ORIGINS
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean)

const swaggerSpec = swaggerJSDoc({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Vendas - Documentação',
            version: '1.0.0'
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: 'error' },
                        statusCode: { type: 'integer', example: 400 },
                        message: { type: 'string', example: 'Dados inválidos' },
                        details: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    field: { type: 'string' },
                                    message: { type: 'string' },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    apis: [path.resolve(process.cwd(), 'src/**/http/routes/*.ts')]
})

const app = express()

app.disable('x-powered-by')
app.use(cors({ origin: allowedOrigins, methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] }))
app.use(express.json({ limit: '1mb' }))
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')))
app.use(routes)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use((_req, _res, next) => next(new NotFoundError('Rota não encontrada')))
app.use(errorHandle)

export default app
