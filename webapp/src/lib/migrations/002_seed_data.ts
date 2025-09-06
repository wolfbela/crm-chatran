import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // Insérer des personnes d'exemple
  const personnes = await db
    .insertInto('personnes')
    .values([
      {
        name: 'Sarah Cohen',
        age: 28,
        religious_level: 3,
        center_of_interest: ['lecture', 'cuisine', 'yoga', 'voyages']
      },
      {
        name: 'David Levy',
        age: 32,
        religious_level: 2,
        center_of_interest: ['sport', 'musique', 'technologie']
      },
      {
        name: 'Rachel Klein',
        age: 26,
        religious_level: 4,
        center_of_interest: ['art', 'photographie', 'randonnée']
      },
      {
        name: 'Michael Rosen',
        age: 30,
        religious_level: 1,
        center_of_interest: ['cinéma', 'littérature', 'histoire']
      },
      {
        name: 'Esther Gold',
        age: 29,
        religious_level: 5,
        center_of_interest: ['étude', 'famille', 'communauté', 'bénévolat']
      },
      {
        name: 'Jonathan Miller',
        age: 35,
        religious_level: 3,
        center_of_interest: ['business', 'finance', 'tennis']
      }
    ])
    .returning('id')
    .execute()

  // Insérer des meetings d'exemple avec les IDs récupérés
  if (personnes.length >= 6) {
    await db
      .insertInto('meetings')
      .values([
        {
          personne_1: personnes[0].id,
          personne_2: personnes[1].id,
          date: new Date('2024-01-15')
        },
        {
          personne_1: personnes[2].id,
          personne_2: personnes[3].id,
          date: new Date('2024-01-22')
        },
        {
          personne_1: personnes[0].id,
          personne_2: personnes[4].id,
          date: new Date('2024-02-05')
        },
        {
          personne_1: personnes[1].id,
          personne_2: personnes[5].id,
          date: new Date('2024-02-14')
        },
        {
          personne_1: personnes[2].id,
          personne_2: personnes[5].id,
          date: new Date('2024-03-01')
        }
      ])
      .execute()
  }
}

export async function down(db: Kysely<any>): Promise<void> {
  // Supprimer les données de test
  await db.deleteFrom('meetings').execute()
  await db.deleteFrom('personnes').execute()
}
