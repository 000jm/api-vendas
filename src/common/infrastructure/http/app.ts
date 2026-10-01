
import routes from './routes/routes.ts'
import cors from 'cors'
import express from 'express'
import errorHandle from './middlewares/errorHandle.ts'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const corsSettings = {
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET']
}

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0'
        }
    },
    apis: ['./src/**/http/routes/*.ts']
}

const swaggerSpec = swaggerJSDoc(options)

const app = express()

app.use(express.json())
app.use(cors(corsSettings))
app.use(routes)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use(errorHandle)

export default app
