import { Injectable, Inject } from '@nestjs/common';
import { DATABASE_MODULE_OPTIONS_TOKEN } from './database,module-defginition';
import { DatabaseModuleOptions } from './database.interface';

@Injectable()
export class DatabaseService {
  constructor(
    @Inject(DATABASE_MODULE_OPTIONS_TOKEN)
    private options: DatabaseModuleOptions,
  ) {}
}
