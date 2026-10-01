
import app from './app.ts'
import { env } from '../env/index.ts'
import dataSource from '../typeorm/index.ts'

dataSource
.initialize()
.then(() => {
    app.listen(env.PORT, () => {
        console.log(`running on ${env.PORT}, acess in ${env.API_URL}`)
        console.log(`Acess our api documentation on GET ${env.API_URL}/docs`)
    })
})
.catch((error) => console.error('error initializing data source: ', error))
