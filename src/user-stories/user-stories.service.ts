import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { customProvier } from 'src/constants';
import { UserStoryDto, userStories } from 'src/database/database.schema';
import { DB_CLIENT } from 'src/types';
import { handleExceptionThrow } from 'src/utils';

@Injectable()
export class UserStoriesService {
  constructor(@Inject(customProvier.DB_CLIENT) private dbClient: DB_CLIENT) {}

  async create(userStoryDto: UserStoryDto) {
    try {
      await this.dbClient.insert(userStories).values(userStoryDto);
      return { message: 'User story is added' };
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
          eq(userStories.sprintId, null),
        ),
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
}
