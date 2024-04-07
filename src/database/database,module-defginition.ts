import { ConfigurableModuleBuilder } from '@nestjs/common';
import { DatabaseModuleOptions } from './database.interface';

export const {
  ConfigurableModuleClass: DatabaseConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN: DATABASE_MODULE_OPTIONS_TOKEN,
} = new ConfigurableModuleBuilder<DatabaseModuleOptions>()
  .setExtras(
    {
      isGlobal: true,
    },
    (definition, extras) => ({
      ...definition,
      global: extras.isGlobal,
    }),
  )
  .build();
