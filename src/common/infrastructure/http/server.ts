
import 'reflect-metadata'
import app from './app.ts'
import { env } from '../env/index.ts'
import dataSource from '../typeorm/index.ts'

dataSource
.initialize()
.then(async () => {
    // await dataSource.manager.query('DELETE FROM products')
    // await dataSource.manager.query('DELETE FROM users')
    // await dataSource.manager.query('DELETE FROM user_tokens')
    app.listen(env.PORT, () => {
        console.log(`running on ${env.PORT}, acess in ${env.API_URL}`)
        console.log(`Acess our api documentation on GET ${env.API_URL}/docs`)
    })
})
.catch((error) => console.error('error initializing data source: ', error))
