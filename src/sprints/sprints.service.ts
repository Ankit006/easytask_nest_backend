import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { asc, eq } from 'drizzle-orm';
import { customProvier } from 'src/constants';
import { SprintDto, sprints, userStories } from 'src/database/database.schema';
import { DB_CLIENT } from 'src/types';
import { handleExceptionThrow } from 'src/utils';
import { AssingBacklogDto } from './sprints.validation';

@Injectable()
export class SprintsService {
  constructor(@Inject(customProvier.DB_CLIENT) private dbClient: DB_CLIENT) {}

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
}
