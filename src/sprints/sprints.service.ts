import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { customProvier } from 'src/constants';
import { SprintDto, sprints } from 'src/database/database.schema';
import { DB_CLIENT } from 'src/types';

@Injectable()
export class SprintsService {
  constructor(@Inject(customProvier.DB_CLIENT) private dbClient: DB_CLIENT) {}

  async create({
    startDate,
    endDate,
    description,
    projectId,
  }: SprintDto & { projectId: string }) {
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
}
