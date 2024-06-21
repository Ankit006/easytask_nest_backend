import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { asc, eq } from 'drizzle-orm';
import { customProvier } from 'src/constants';
import { SprintDto, sprints } from 'src/database/database.schema';
import { DB_CLIENT } from 'src/types';
import { handleExceptionThrow } from 'src/utils';

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
}
