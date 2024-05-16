import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Request } from 'express';
import { CacheService } from 'src/cache/cache.service';
import { customProvier, redisCacheKey } from 'src/constants';
import { IMember } from 'src/database/database.schema';
import { NotificationGatewayGateway } from 'src/notification-gateway/notification-gateway.gateway';
import { projectIdValidate } from 'src/projects/projects.validation';
import { DB_CLIENT } from 'src/types';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MembersService {
  constructor(
    @Inject(customProvier.DB_CLIENT) private dbClient: DB_CLIENT,
    private cacheService: CacheService,
    private notificationGatewayGateway: NotificationGatewayGateway,
    private userService: UsersService,
  ) {}

  async member(request: Request, projectId: string) {
    const parsedProjectId = projectIdValidate.safeParse(projectId);
    if (parsedProjectId.success === false) {
      throw new UnprocessableEntityException('Not a valid project id');
    }
    try {
      const cachedMember = await this.cacheService.get(
        `${request['user'].id}`,
        redisCacheKey(projectId).member,
      );
      if (cachedMember) {
        return JSON.parse(cachedMember) as IMember;
      } else {
        const member = await this.dbClient.query.members.findFirst({
          where: (members, { and, eq }) =>
            and(
              eq(members.user_id, request['user'].id),
              eq(members.project_id, parseInt(projectId)),
            ),
          with: {
            users: {
              columns: {
                password: false,
              },
            },
          },
        });

        await this.cacheService.store(
          `${request['user'].id}`,
          redisCacheKey(projectId).member,
          JSON.stringify(member),
        );
        return member;
      }
    } catch (err) {
      throw new InternalServerErrorException(
        'Something went wrong in the server',
        { cause: err },
      );
    }
  }
  async invite(projectId: number, userId: number) {
    const user = await this.userService.getUser(userId.toString());
    await this.notificationGatewayGateway.sendJoinNotification(
      userId,
      projectId,
      user.name,
    );
    return { message: 'A join notification is sent' };
  }
}
