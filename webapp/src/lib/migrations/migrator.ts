import { Migrator, FileMigrationProvider } from "kysely";
import { promises as fs } from "fs";
import * as path from "path";
import { db } from "../database";

const migrationFolder = path.join(__dirname);

async function migrateToLatest() {
  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder,
    }),
  });

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === "Success") {
      console.log(`Migration "${it.migrationName}" executed successfully`);
    } else if (it.status === "Error") {
      console.error(`Failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error("Failed to migrate");
    console.error(error);
    process.exit(1);
  }

  await db.destroy();
}

async function migrateDown() {
  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder,
    }),
  });

  const { error, results } = await migrator.migrateDown();

  results?.forEach((it) => {
    if (it.status === "Success") {
      console.log(`Migration "${it.migrationName}" reverted successfully`);
    } else if (it.status === "Error") {
      console.error(`Failed to revert migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error("Failed to migrate down");
    console.error(error);
    process.exit(1);
  }

  await db.destroy();
}

if (require.main === module) {
  const command = process.argv[2];

  if (command === "up") {
    migrateToLatest();
  } else if (command === "down") {
    migrateDown();
  } else {
    console.log("Usage: tsx migrator.ts [up|down]");
    process.exit(1);
  }
}

export { migrateToLatest, migrateDown };
