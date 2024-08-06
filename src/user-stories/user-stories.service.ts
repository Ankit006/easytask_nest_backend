import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, asc, eq, isNull } from 'drizzle-orm';
import { Request } from 'express';
import { customProvier } from 'src/constants';
import {
  UserStoryDto,
  userStories,
  userStoriesToMembers,
} from 'src/database/database.schema';
import { MembersService } from 'src/members/members.service';
import { DB_CLIENT } from 'src/types';
import { handleExceptionThrow } from 'src/utils';

@Injectable()
export class UserStoriesService {
  constructor(
    @Inject(customProvier.DB_CLIENT) private dbClient: DB_CLIENT,
    private memberService: MembersService,
  ) {}

  async create(userStoryDto: UserStoryDto) {
    try {
      await this.dbClient.insert(userStories).values(userStoryDto);
      return { message: 'User story is added' };
    } catch (err) {
      handleExceptionThrow(err);
    }
  }

  async update(userStoryDto: UserStoryDto) {
    try {
      await this.dbClient
        .update(userStories)
        .set(userStoryDto)
        .where(eq(userStories.id, userStoryDto.id));
      return { message: 'Update story updated' };
    } catch (err) {
      handleExceptionThrow(err);
    }
  }

  async get(userStoryId: number) {
    try {
      const res = await this.dbClient.query.userStories.findFirst({
        where: eq(userStories.id, userStoryId),
      });
      if (!res) {
        throw new NotFoundException('User story not found');
      }
      return res;
    } catch (err) {
      handleExceptionThrow(err);
    }
  }

  async getBacklogs(projectId: number) {
    try {
      const res = await this.dbClient.query.userStories.findMany({
        where: and(
          eq(userStories.projectId, projectId),
          isNull(userStories.sprintId),
        ),
        orderBy: asc(userStories.createdAt),
      });
      return res;
    } catch (err) {
      handleExceptionThrow(err);
    }
  }

  async delete(userStoryId: number) {
    try {
      await this.dbClient
        .delete(userStories)
        .where(eq(userStories.id, userStoryId));
      return { message: 'User story is removed' };
    } catch (err) {
      handleExceptionThrow(err);
    }
  }

  async assignMember(request: Request, projectId: number, userStoryId: number) {
    try {
      const member = await this.memberService.member(request, projectId);
      await this.dbClient
        .insert(userStoriesToMembers)
        .values({ memberId: member.id, userStoryId });
      return { message: `${member.users.name} is assigned ` };
    } catch (err) {
      handleExceptionThrow(err);
    }
  }

  async removeMember(request: Request, projectId: number, userStoryId: number) {
    try {
      const member = await this.memberService.member(request, projectId);
      await this.dbClient
        .delete(userStoriesToMembers)
        .where(
          and(
            eq(userStoriesToMembers.memberId, member.id),
            eq(userStoriesToMembers.userStoryId, userStoryId),
          ),
        );
      return { message: `${member.users.name} is removed` };
    } catch (err) {
      handleExceptionThrow(err);
    }
  }
}
