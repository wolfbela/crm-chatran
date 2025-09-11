import { Kysely, PostgresDialect, Generated } from "kysely";
import { Pool } from "pg";

interface Database {
  users: {
    id: Generated<string>;
    email: string;
    password: string;
    confirmed: Generated<boolean>;
    reset_token?: string;
    reset_token_expires?: Date;
    confirmation_token?: string;
    created_at: Generated<Date>;
    updated_at: Generated<Date>;
  };
  personnes: {
    id: Generated<string>;
    name: string;
    age: number;
    religious_level: number;
    center_of_interest: string[];
    phone: string | null;
    created_at: Generated<Date>;
    updated_at: Generated<Date>;
  };
  meetings: {
    id: Generated<number>;
    personne_1: string;
    personne_2: string;
    date: Date;
    created_at: Generated<Date>;
  };
}

const createDialect = () => {
  const config = {
    database: process.env.POSTGRES_DB || "webapp",
    host: process.env.POSTGRES_HOST || "192.168.56.10",
    user: process.env.POSTGRES_USER || "lama",
    password: process.env.POSTGRES_PASSWORD || "JaimeLesChevaux",
    port: parseInt(process.env.POSTGRES_PORT || "5432"),
    max: 10,
    connectionTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
    allowExitOnIdle: true,
  };

  // Enhanced connection handling for VM setup
  if (config.host === "192.168.56.10") {
    config.connectionTimeoutMillis = 60000;
    config.idleTimeoutMillis = 60000;
  }

  return new PostgresDialect({
    pool: new Pool(config),
  });
};

export const db = new Kysely<Database>({
  dialect: createDialect(),
});

// Connection test function
export const testConnection = async () => {
  try {
    await db.selectFrom("users").select("id").limit(1).execute();
    return { success: true, message: "Database connection successful" };
  } catch (error) {
    return {
      success: false,
      message: `Database connection failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
};

export type { Database };
