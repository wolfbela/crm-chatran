#!/usr/bin/env tsx

import { migrateToLatest, migrateDown } from './src/lib/migrations/migrator';

async function main() {
  const command = process.argv[2];

  console.log('🚀 Starting migration process...');

  try {
    if (command === 'up' || !command) {
      console.log('📈 Running migrations up...');
      await migrateToLatest();
      console.log('✅ Migration completed successfully!');
    } else if (command === 'down') {
      console.log('📉 Running migration down...');
      await migrateDown();
      console.log('✅ Rollback completed successfully!');
    } else {
      console.error('❌ Invalid command. Use: tsx migrate.ts [up|down]');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

main();
