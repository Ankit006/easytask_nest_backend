import { Global, Module, Provider } from '@nestjs/common';
import { CacheService } from './cache.service';
import { createClient } from 'redis';

const redisClient: Provider = {
  provide: 'REDIS_CLIENT',
  useFactory: async () => {
    const client = createClient({
      url: 'redis://redis:6379',
    });
    await client.connect();
    return client;
  },
};

@Global()
@Module({
  providers: [CacheService, redisClient],
  exports: [CacheService],
})
export class CacheModule {}
