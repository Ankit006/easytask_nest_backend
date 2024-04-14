import dotenv from 'dotenv';
import path from 'path';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const envPath = path.resolve(__dirname, '..', '..', '.env');
dotenv.config({ path: envPath });

if (!process.env.POSTGRES_CONNECTION_STRING) {
  console.error('Missing POSTGRES_CONNECTION_STRING in environment variables.');
  process.exit(1); // Exit with error
}

const migrationClient = postgres(process.env.POSTGRES_CONNECTION_STRING, {
  max: 1,
});

const db = drizzle(migrationClient);

async function migration() {
  await migrate(db, { migrationsFolder: './migration' });
  await migrationClient.end();
}

migration();
