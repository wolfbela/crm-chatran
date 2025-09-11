import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // Drop existing users table if it exists
  await db.schema.dropTable('users').ifExists().execute()

  // Create users table for authentication
  await db.schema
    .createTable('users')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn('email', 'varchar', (col) => col.notNull().unique())
    .addColumn('password', 'varchar', (col) => col.notNull())
    .addColumn('confirmed', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('reset_token', 'varchar')
    .addColumn('reset_token_expires', 'timestamp')
    .addColumn('confirmation_token', 'varchar')
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute()

  // Add indexes for better performance
  await db.schema
    .createIndex('users_email_idx')
    .on('users')
    .column('email')
    .execute()

  await db.schema
    .createIndex('users_reset_token_idx')
    .on('users')
    .column('reset_token')
    .execute()

  await db.schema
    .createIndex('users_confirmation_token_idx')
    .on('users')
    .column('confirmation_token')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('users').execute()

  // Recreate the old users table structure
  await db.schema
    .createTable('users')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('email', 'varchar', (col) => col.notNull())
    .addColumn('name', 'varchar', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute()
}
