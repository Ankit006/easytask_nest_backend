import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
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
      return user;
    } catch {
      throw new InternalServerErrorException(
        'Something went wrong in the server',
      );
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
            eq(members.project_id, projectId),
            eq(members.user_id, currentUserId),
          ),
      });
      if (res) {
        throw new ConflictException('You already joined in this project');
      }
      await this.dbClient.insert(members).values({
        user_id: currentUserId,
        project_id: projectId,
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
