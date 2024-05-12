import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Request } from 'express';
import { CacheService } from 'src/cache/cache.service';
import { customProvier } from 'src/constants';
import { IMember } from 'src/database/database.schema';
import { projectIdValidate } from 'src/projects/projects.validation';
import { DB_CLIENT } from 'src/types';

@Injectable()
export class MembersService {
  constructor(
    @Inject(customProvier.DB_CLIENT) private dbClient: DB_CLIENT,
    private cacheService: CacheService,
  ) {}

  async member(request: Request, projectId: string) {
    const parsedProjectId = projectIdValidate.safeParse(projectId);
    if (parsedProjectId.success === false) {
      throw new UnprocessableEntityException('Not a valid project id');
    }
    try {
      const cachedMember = await this.cacheService.get(
        `${request['user'].id}`,
        `${projectId}:member`,
      );
      if (cachedMember) {
        return JSON.parse(cachedMember) as IMember;
      } else {
        const member = await this.dbClient.query.members.findFirst({
          where: (members, { and, eq }) =>
            and(
              eq(members.user_id, request['user'].id),
              eq(members.project_id, parseInt(projectId)),
            ),
          with: {
            users: {
              columns: {
                password: false,
              },
            },
          },
        });

        await this.cacheService.store(
          `${request['user'].id}`,
          `${projectId}:member`,
          JSON.stringify(member),
        );
        return member;
      }
    } catch (err) {
      throw new InternalServerErrorException(
        'Something went wrong in the server',
        { cause: err },
      );
    }
  }
  async invite(projectId: string, userId: string) {}
}
