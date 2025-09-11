import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('personnes')
    .addColumn('phone', 'varchar(20)')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('personnes')
    .dropColumn('phone')
    .execute()
}
