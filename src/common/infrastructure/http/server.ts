import 'reflect-metadata'
import '@/common/infrastructure/container'
import app from './app'
import { env } from '../env'
import dataSource from '../typeorm'

dataSource
    .initialize()
    .then(() => {
        app.listen(env.PORT, () => {
            console.log(`API rodando em ${env.API_URL}`)
            console.log(`Documentação disponível em ${env.API_URL}/docs`)
        })
    })
    .catch(error => {
        console.error('Erro ao inicializar o banco de dados:', error)
        process.exit(1)
    })
