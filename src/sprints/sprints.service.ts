import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { asc, eq } from 'drizzle-orm';
import { customProvier } from 'src/constants';
import {
  IUserStory,
  SprintDto,
  sprints,
  userStories,
  userStoriesToMembers,
} from 'src/database/database.schema';
import { DB_CLIENT } from 'src/types';
import { handleExceptionThrow } from 'src/utils';
import { AssingBacklogDto } from './sprints.validation';
import { MembersService } from 'src/members/members.service';
import { Request } from 'express';

@Injectable()
export class SprintsService {
  constructor(
    @Inject(customProvier.DB_CLIENT) private dbClient: DB_CLIENT,
    private memberService: MembersService,
  ) {}

  async create({
    startDate,
    endDate,
    description,
    projectId,
    title,
  }: SprintDto) {
    try {
      await this.dbClient
        .insert(sprints)
        .values({ startDate, endDate, description, projectId, title });
      return { message: 'Sprint is created' };
    } catch {
      throw new InternalServerErrorException(
        'Something went wrong in the server',
      );
    }
  }

  async update(sprintDto: SprintDto) {
    try {
      await this.dbClient
        .update(sprints)
        .set(sprintDto)
        .where(eq(sprints.id, sprintDto.id));
      return { message: 'Sprint is updated' };
    } catch (err) {
      handleExceptionThrow(err);
    }
  }

  async getAll(projectId: number) {
    try {
      const res = await this.dbClient.query.sprints.findMany({
        where: eq(sprints.projectId, projectId),
        orderBy: asc(sprints.createdAt),
      });
      return res;
    } catch (err) {
      handleExceptionThrow(err);
    }
  }

  async get(sprintId: number) {
    try {
      const res = await this.dbClient.query.sprints.findFirst({
        where: eq(sprints.id, sprintId),
      });
      if (!res) {
        throw new NotFoundException('Sprint not found');
      }
      return res;
    } catch (err) {
      handleExceptionThrow(err);
    }
  }

  async remove(sprintId: number) {
    try {
      await this.dbClient.delete(sprints).where(eq(sprints.id, sprintId));
      return { message: 'Sprint is removed' };
    } catch (err) {
      handleExceptionThrow(err);
    }
  }

  async assingBackLog({ backlogId, sprintId }: AssingBacklogDto) {
    try {
      await this.dbClient
        .update(userStories)
        .set({ sprintId })
        .where(eq(userStories.id, backlogId));
      return { message: 'Backlog is assinged' };
    } catch (err) {
      handleExceptionThrow(err);
    }
  }

  async removeUserStory(backlogId: number) {
    try {
      await this.dbClient
        .update(userStories)
        .set({ sprintId: null })
        .where(eq(userStories.id, backlogId));
      return { message: 'user story is removed from sprint' };
    } catch (err) {
      handleExceptionThrow(err);
    }
  }

  // return all userStory if user is admin or moderator. If the user is a member then
  // it will return userStories assigned to them
  async getUserStories(request: Request, projectId: number, sprintId: number) {
    try {
      const currentMember = await this.memberService.member(request, projectId);

      if (currentMember.role !== 'member') {
        const res = await this.dbClient.query.userStories.findMany({
          where: eq(userStories.sprintId, sprintId),
        });
        return res;
      } else {
        const res = await this.dbClient.query.userStoriesToMembers.findMany({
          where: eq(userStoriesToMembers.memberId, currentMember.id),
          with: {
            userStory: true,
          },
        });

        const userStoryList: IUserStory[] = [];

        for (const value of res) {
          userStoryList.push(value.userStory);
        }
        return userStoryList;
      }
    } catch (err) {
      handleExceptionThrow(err);
    }
  }
}
