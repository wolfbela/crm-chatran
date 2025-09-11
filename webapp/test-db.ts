import { db, testConnection } from './src/lib/database';

async function testDatabaseOperations() {
  console.log('🔍 Testing database connection...');

  // Test connection
  const connectionResult = await testConnection();
  if (!connectionResult.success) {
    console.error('❌ Database connection failed:', connectionResult.message);
    process.exit(1);
  }

  console.log('✅ Database connection successful');

  try {
    // Test users table
    console.log('\n📊 Testing users table...');

    const usersCount = await db
      .selectFrom('users')
      .select(db.fn.count('id').as('count'))
      .executeTakeFirst();

    console.log(`✅ Users table accessible - ${usersCount?.count} users found`);

    // Test personnes table
    console.log('\n📊 Testing personnes table...');

    const personnesCount = await db
      .selectFrom('personnes')
      .select(db.fn.count('id').as('count'))
      .executeTakeFirst();

    console.log(`✅ Personnes table accessible - ${personnesCount?.count} personnes found`);

    // Test meetings table
    console.log('\n📊 Testing meetings table...');

    const meetingsCount = await db
      .selectFrom('meetings')
      .select(db.fn.count('id').as('count'))
      .executeTakeFirst();

    console.log(`✅ Meetings table accessible - ${meetingsCount?.count} meetings found`);

    console.log('\n🎉 All database tests passed!');

  } catch (error) {
    console.error('❌ Database test failed:', error);
    process.exit(1);
  }

  process.exit(0);
}

testDatabaseOperations();
