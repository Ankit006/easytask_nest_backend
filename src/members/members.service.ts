import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { Request } from 'express';
import { CacheService } from 'src/cache/cache.service';
import { SocketEvent, customProvier, redisCacheKey } from 'src/constants';
import { IMember, projects, users } from 'src/database/database.schema';
import { NotificationGatewayGateway } from 'src/notification-gateway/notification-gateway.gateway';
import { projectIdValidate } from 'src/projects/projects.validation';
import { DB_CLIENT } from 'src/types';
import { UsersService } from 'src/users/users.service';
import { handleExceptionThrow } from 'src/utils';
import { v4 as uuid } from 'uuid';
import { IJoinNotification } from './member.interface';

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
  async invite(projectId: number, targetUserId: number, request: Request) {
    const user = await this.userService.getUser(request['user'].id);
    try {
      const memberInfo = await this.dbClient.query.members.findFirst({
        where: (members, { and, eq }) =>
          and(
            eq(members.project_id, projectId),
            eq(members.user_id, targetUserId),
          ),
      });

      if (memberInfo) {
        throw new ConflictException(
          'This user is already member of this project',
        );
      }

      const project = await this.dbClient.query.projects.findFirst({
        where: eq(projects.id, projectId),
      });
      const joinNotification: IJoinNotification = {
        sender: user,
        project,
        type: 'invite',
        id: uuid(),
      };
      await this.cacheService.listPush(
        redisCacheKey(undefined, targetUserId).notifications,
        JSON.stringify(joinNotification),
      );

      await this.notificationGatewayGateway.sendNotification(
        targetUserId,
        SocketEvent.notification,
        `${user.name} wants you to join in ${project.title} `,
      );
      return { message: 'A join notification is sent' };
    } catch (err) {
      handleExceptionThrow(err);
    }
  }

  async searchUserByEmail(email: string, request: Request) {
    if (email === request['user'].email) {
      throw new UnprocessableEntityException('current user email is provided');
    }

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
    } catch (err) {
      handleExceptionThrow(err);
    }
  }
}
