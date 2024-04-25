import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateProjectDto } from './projects.validation';
import { customProvier } from 'src/constants';
import { DB_CLIENT } from 'src/types';
import { members, projects } from 'src/database/database.schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class ProjectsService {
  constructor(@Inject(customProvier.DB_CLIENT) private dbClient: DB_CLIENT) {}
  async create({
    title,
    description,
    request,
  }: CreateProjectDto & { request: Request }) {
    try {
      const res = await this.dbClient
        .insert(projects)
        .values({ title, description })
        .returning();

      await this.dbClient.insert(members).values({
        user_id: request['user'].id,
        project_id: res[0].id,
        role: 'admin',
      });

      return res[0];
    } catch (err) {
      throw new InternalServerErrorException(
        'Something went wrong in the server',
        { cause: err },
      );
    }
  }

  async update({ id, title, description }: CreateProjectDto & { id: number }) {
    try {
      const res = await this.dbClient
        .update(projects)
        .set({ title, description })
        .where(eq(projects.id, id))
        .returning();
      return res[0];
    } catch (err) {
      throw new InternalServerErrorException(
        'Something went wrong in the server',
        { cause: err },
      );
    }
  }

  async remove(id: number) {
    try {
      const res = await this.dbClient
        .delete(projects)
        .where(eq(projects.id, id))
        .returning();
      return res[0];
    } catch (err) {
      throw new InternalServerErrorException(
        'Something went wrong in the server',
        { cause: err },
      );
    }
  }
}
