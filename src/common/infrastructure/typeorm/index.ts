import { DataSource } from 'typeorm'
import path from 'node:path'
import { env } from '../env'

const dataSource = new DataSource({
    type: env.DB_TYPE as 'postgres',
    host: env.DB_HOST,
    port: env.DB_PORT,
    schema: env.DB_SCHEMA,
    database: env.DB_NAME,
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    entities: [path.resolve(__dirname, '../../../**/entities/**/*.ts')],
    migrations: [path.resolve(__dirname, '../migrations/*.ts')],
    synchronize: false,
    logging: false
})

export default dataSource
