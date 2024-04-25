import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../database/database.schema';

export type DB_CLIENT = PostgresJsDatabase<typeof schema>;
