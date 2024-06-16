import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { eq } from 'drizzle-orm';
import { customProvier } from 'src/constants';
import {
  IProject,
  ProjectDto,
  members,
  projects,
} from 'src/database/database.schema';
import { DB_CLIENT } from 'src/types';
import { handleExceptionThrow } from 'src/utils';
import { projectIdValidate } from './projects.validation';

@Injectable()
export class ProjectsService {
  constructor(@Inject(customProvier.DB_CLIENT) private dbClient: DB_CLIENT) {}
  async create({
    title,
    description,
    request,
  }: ProjectDto & { request: Request }): Promise<IProject> {
    try {
      const res = await this.dbClient.transaction(async (tx) => {
        const res = await tx
          .insert(projects)
          .values({ title, description })
          .returning();
        await tx.insert(members).values({
          userId: request['user'].id,
          projectId: res[0].id,
          role: 'admin',
        });
        return res;
      });
      return res[0];
    } catch (err) {
      handleExceptionThrow(err);
    }
  }

  async update({
    id,
    title,
    description,
  }: ProjectDto & { id: number }): Promise<IProject> {
    try {
      const res = await this.dbClient
        .update(projects)
        .set({ title, description })
        .where(eq(projects.id, id))
        .returning();
      return res[0];
    } catch (err) {
      handleExceptionThrow(err);
    }
  }

  async getAll(request: Request): Promise<IProject[]> {
    try {
      const projects: IProject[] = [];
      const memberWithprojects = await this.dbClient.query.members.findMany({
        where: eq(members.userId, request['user'].id),
        with: {
          projects: true,
        },
      });

      for (const member of memberWithprojects) {
        projects.push(member.projects);
      }
      return projects;
    } catch (err) {
      handleExceptionThrow(err);
    }
  }

  async get(projectId: string): Promise<IProject> {
    const parsedProjectId = projectIdValidate.safeParse(projectId);

    if (parsedProjectId.success === false) {
      throw new UnprocessableEntityException('Not a valid project id');
    }
    try {
      const project = await this.dbClient.query.projects.findFirst({
        where: eq(projects.id, parseInt(projectId)),
      });
      if (!project) {
        throw new NotFoundException('No project found');
      }
      return project;
    } catch (err) {
      handleExceptionThrow(err);
    }
  }

  async remove({ id }: ProjectDto): Promise<IProject> {
    try {
      const res = await this.dbClient
        .delete(projects)
        .where(eq(projects.id, id))
        .returning();
      return res[0];
    } catch (err) {
      handleExceptionThrow(err);
    }
  }
}
