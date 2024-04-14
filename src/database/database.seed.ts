import * as schema from './database.schema';
import dotenv from 'dotenv';
import path from 'path';
import postgres = require('postgres');
import { drizzle } from 'drizzle-orm/postgres-js';
import { faker } from '@faker-js/faker';

const envPath = path.resolve(__dirname, '..', '..', '.env');
dotenv.config({ path: envPath });

const client = postgres(process.env.POSTGRES_CONNECTION_STRING, { max: 1 });

const db = drizzle(client);

async function main() {
  // insert users
  interface IUser {
    name: string;
    email: string;
    password: string;
  }

  const users: IUser[] = [];

  for (let x = 1; x <= 100; x++) {
    users.push({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });
  }

  await db.insert(schema.users).values(users);
}

main();
