import {
  Inject,
  Injectable,
  InternalServerErrorException,
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
  }: SprintDto & { projectId: number }) {
    try {
      const res = await this.dbClient
        .insert(sprints)
        .values({ startDate, endDate, description, projectId })
        .returning();
      return res[0];
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
}
