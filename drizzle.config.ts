import 'dotenv/config';
import { Config } from 'drizzle-kit';

export default {
  schema: './src/database/database.schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.POSTGRES_CONNECTION_STRING!,
  },
} satisfies Config;
