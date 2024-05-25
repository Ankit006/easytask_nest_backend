import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { CacheService } from 'src/cache/cache.service';
import { customProvier, redisCacheKey } from 'src/constants';
import { users } from 'src/database/database.schema';
import { DB_CLIENT } from 'src/types';

@Injectable()
export class UsersService {
  constructor(
    @Inject(customProvier.DB_CLIENT) private dbClient: DB_CLIENT,
    private cacheService: CacheService,
  ) {}
  async getUser(userId: string) {
    try {
      const user = await this.dbClient.query.users.findFirst({
        where: eq(users.id, parseInt(userId)),
        columns: {
          password: false,
        },
      });
      return user;
    } catch {
      throw new InternalServerErrorException(
        'Something went wrong in the server',
      );
    }
  }

  async notifications(userId: string) {
    const res = await this.cacheService.getListValues(
      redisCacheKey(undefined, userId).notifications,
    );
    return res.length > 0 ? res.map((data) => JSON.parse(data)) : res;
  }

  async clearNotification(userId: string) {
    await this.cacheService.removeListCache(
      redisCacheKey(null, userId).notifications,
    );
    return { message: 'Notification is cleared' };
  }
}
