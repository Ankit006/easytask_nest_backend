import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { Request } from 'express';
import { NotificationGatewayGateway } from 'src/notification-gateway/notification-gateway.gateway';
import { projectIdValidate } from 'src/projects/projects.validation';
import { DB_CLIENT } from 'src/types';
import { UsersService } from 'src/users/users.service';
import { handleExceptionThrow } from 'src/utils';
import { v4 as uuid } from 'uuid';
import { IJoinNotification } from './member.interface';
import { MemberRoleUpdateDto } from './member.validation';
import { CacheService } from 'src/cache/cache.service';
import { customProvier, redisCacheKey, SocketEvent } from 'src/constants';
import { members, projects, users } from 'src/database/database.schema';

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
      const member = await this.dbClient.query.members.findFirst({
        where: (members, { and, eq }) =>
          and(
            eq(members.userId, request['user'].id),
            eq(members.projectId, parseInt(projectId)),
          ),
        with: {
          users: {
            columns: {
              password: false,
            },
          },
        },
      });
      if (!member) {
        throw new NotFoundException('User not found');
      }
      return member;
    } catch (err) {
      handleExceptionThrow(err);
    }
  }
  async invite(projectId: number, targetUserId: number, request: Request) {
    const user = await this.userService.getUser(request['user'].id);
    try {
      const memberInfo = await this.dbClient.query.members.findFirst({
        where: (members, { and, eq }) =>
          and(
            eq(members.projectId, projectId),
            eq(members.userId, targetUserId),
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

  async getMembers(projectId: number) {
    try {
      const res = await this.dbClient.query.members.findMany({
        where: eq(members.projectId, projectId),
        with: {
          users: {
            columns: {
              password: false,
            },
          },
          membersToGroups: {
            with: {
              group: true,
            },
          },
        },
      });
      return res;
    } catch (err) {
      handleExceptionThrow(err);
    }
  }

  async updateRole(memberRoleUpdateDto: MemberRoleUpdateDto) {
    const { projectId, member_id, role } = memberRoleUpdateDto;
    if (role === 'admin') {
      throw new ForbiddenException('You cannot make a user an admin');
    }
    try {
      await this.dbClient
        .update(members)
        .set({ role: role === 'member' ? 'member' : 'moderator' })
        .where(
          and(eq(members.userId, member_id), eq(members.projectId, projectId)),
        );
      return { message: 'Member role updated' };
    } catch (err) {
      handleExceptionThrow(err);
    }
  }
}
