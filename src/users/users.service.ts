import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { CacheService } from 'src/cache/cache.service';
import { customProvier, redisCacheKey } from 'src/constants';
import { members, users } from 'src/database/database.schema';
import { DB_CLIENT } from 'src/types';
import { handleExceptionThrow } from 'src/utils';

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

      if (!user) {
        throw new UnauthorizedException('Unauthorized access');
      }
      return user;
    } catch (err) {
      handleExceptionThrow(err);
    }
  }

  async joinProject(
    projectId: number,
    currentUserId: number,
    notification: string,
  ) {
    try {
      const res = await this.dbClient.query.members.findFirst({
        where: (members, { and, eq }) =>
          and(
            eq(members.projectId, projectId),
            eq(members.userId, currentUserId),
          ),
      });
      if (res) {
        throw new ConflictException('You already joined in this project');
      }
      await this.dbClient.insert(members).values({
        userId: currentUserId,
        projectId: projectId,
        role: 'member',
      });
      await this.cacheService.removeSingleFromList(
        redisCacheKey(null, currentUserId).notifications,
        notification,
      );
      return { message: 'You joined successfully' };
    } catch (error) {
      handleExceptionThrow(error);
    }
  }
}
