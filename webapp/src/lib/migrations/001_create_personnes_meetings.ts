import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // Create personnes table
  await db.schema
    .createTable('personnes')
    .addColumn('id', 'uuid', (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn('name', 'varchar', (col) => col.notNull())
    .addColumn('age', 'integer', (col) => col.notNull())
    .addColumn('religious_level', 'integer', (col) => col.notNull())
    .addColumn('center_of_interest', sql`text[]`, (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute()

  // Create meetings table
  await db.schema
    .createTable('meetings')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('personne_1', 'uuid', (col) =>
      col.notNull().references('personnes.id').onDelete('cascade')
    )
    .addColumn('personne_2', 'uuid', (col) =>
      col.notNull().references('personnes.id').onDelete('cascade')
    )
    .addColumn('date', 'date', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .execute()

  // Add constraint to ensure personne_1 != personne_2
  await sql`
    ALTER TABLE meetings
    ADD CONSTRAINT check_different_personnes
    CHECK (personne_1 != personne_2)
  `.execute(db)

  // Add index for better performance on queries
  await db.schema
    .createIndex('meetings_personne_1_idx')
    .on('meetings')
    .column('personne_1')
    .execute()

  await db.schema
    .createIndex('meetings_personne_2_idx')
    .on('meetings')
    .column('personne_2')
    .execute()

  await db.schema
    .createIndex('meetings_date_idx')
    .on('meetings')
    .column('date')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('meetings').execute()
  await db.schema.dropTable('personnes').execute()
}
