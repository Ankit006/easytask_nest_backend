import { Global, Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './database.schema';
const dbClientProvider: Provider = {
  provide: 'DB_CLIENT',
  useFactory: (configService: ConfigService) => {
    const client = postgres(
      configService.get<string>('POSTGRES_CONNECTION_STRING'),
    );
    const db = drizzle(client, { schema });
    return db;
  },
  inject: [ConfigService],
};

@Global()
@Module({
  providers: [dbClientProvider],
  exports: [dbClientProvider],
})
export class DatabaseModule {}
