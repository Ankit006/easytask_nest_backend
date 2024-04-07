import { Module, Provider } from '@nestjs/common';
import { DatabaseService } from './database.service';
import {
  DATABASE_MODULE_OPTIONS_TOKEN,
  DatabaseConfigurableModuleClass,
} from './database,module-defginition';
import { DatabaseModuleOptions } from './database.interface';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

const DBProvider: Provider = {
  provide: 'DATABASE',
  useFactory: (options: DatabaseModuleOptions) => {
    const queryClient = postgres(options.connectionString);
    return drizzle(queryClient);
  },
  inject: [DATABASE_MODULE_OPTIONS_TOKEN],
};

@Module({
  providers: [DatabaseService, DBProvider],
})
export class DatabaseModule extends DatabaseConfigurableModuleClass {}
