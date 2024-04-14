import * as schema from './database.schema';
import dotenv from 'dotenv';
import path = require('path');
import postgres = require('postgres');
import { drizzle } from 'drizzle-orm/postgres-js';

const envPath = path.resolve(__dirname, '..', '..', '.env');
dotenv.config({ path: envPath });

const client = postgres(process.env.POSTGRES_CONNECTION_STRING, { max: 1 });

const db = drizzle(client);

function main() {}
