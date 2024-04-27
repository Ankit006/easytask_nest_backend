import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { customProvier } from 'src/constants';
import { DB_CLIENT } from 'src/types';
import {
  IProject,
  ProjectDto,
  members,
  projects,
} from 'src/database/database.schema';
import { eq } from 'drizzle-orm';
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
      throw new InternalServerErrorException(
        'Something went wrong in the server',
        { cause: err },
      );
    }
  }

  async getAll(request: Request): Promise<IProject[]> {
    try {
      const projects: IProject[] = [];
      const memberWithprojects = await this.dbClient.query.members.findMany({
        where: (members, { and, eq }) =>
          and(
            eq(members.user_id, request['user'].id),
            eq(members.role, 'admin'),
          ),
        with: {
          projects: true,
        },
      });

      for (const member of memberWithprojects) {
        projects.push(member.projects);
      }
      return projects;
    } catch (err) {
      throw new InternalServerErrorException(
        'Something went wrong in the server',
        { cause: err },
      );
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
      if (err.response && err.response.error) {
        if (err.response.error === 'Not Found') {
          throw new NotFoundException(err.response.message);
        } else {
          throw new InternalServerErrorException(
            'Something went wrong in the server',
            { cause: err },
          );
        }
      }

      throw new InternalServerErrorException(
        'Something went wrong in the server',
        { cause: err },
      );
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
      throw new InternalServerErrorException(
        'Something went wrong in the server',
        { cause: err },
      );
    }
  }
}