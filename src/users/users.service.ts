import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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

  async searchByEmil(email: string) {
    try {
      const res = await this.dbClient.query.users.findFirst({
        where: eq(users.email, email),
        columns: {
          password: false,
        },
      });
      if (res) {
        return res;
      } else {
        throw new NotFoundException('User not found');
      }
    } catch {
      throw new InternalServerErrorException(
        'Something went wrong in the server',
      );
    }
  }

  async notifications(userId: string) {
    return await this.cacheService.getListValues(
      redisCacheKey(undefined, userId).notifications,
    );
  }
}
