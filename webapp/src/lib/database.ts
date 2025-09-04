import { Kysely, PostgresDialect } from 'kysely'
import { Pool } from 'pg'

interface Database {
  users: {
    id: number
    email: string
    name: string
    created_at: Date
    updated_at: Date
  }
}

const dialect = new PostgresDialect({
  pool: new Pool({
    database: process.env.POSTGRES_DB || 'webapp',
    host: process.env.POSTGRES_HOST || 'localhost',
    user: process.env.POSTGRES_USER || 'lama',
    password: process.env.POSTGRES_PASSWORD || 'JaimeLesChevaux',
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    max: 10,
  })
})

export const db = new Kysely<Database>({
  dialect,
})

export type { Database }
