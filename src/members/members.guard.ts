import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { MemberRolesKey, MemberRolesType } from './members.role';
import { customProvier } from 'src/constants';
import { DB_CLIENT } from 'src/types';

@Injectable()
export class MemberRoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(customProvier.DB_CLIENT) private dbClient: DB_CLIENT,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const roles = this.reflector.get<MemberRolesType[]>(
      MemberRolesKey,
      context.getHandler(),
    );

    if (!roles) {
      return true;
    }

    // user can pass projectId on query params for GET or in the body object for POST request
    const bodyProjectId = request.body['projectId'];
    const queryProjectId = request.query['projectId'];
    const { projectId: paramsProjectId } = request.params;

    if (!bodyProjectId && !queryProjectId && !paramsProjectId) {
      throw new UnauthorizedException(
        'You are not allowed to perform this action',
      );
    }

    const projectId = bodyProjectId || queryProjectId || paramsProjectId;

    try {
      const res = await this.dbClient.query.members.findFirst({
        where: (members, { and, eq }) =>
          and(
            eq(members.projectId, projectId),
            eq(members.userId, request['user'].id),
          ),
      });
      if (!res) {
        throw new UnauthorizedException(
          'You are not allowed to perform this action',
        );
      }
      for (const role of roles) {
        if (role === res.role) {
          return true;
        }
      }
      throw new UnauthorizedException(
        'You are not allowed to perform this action',
      );
    } catch {
      throw new InternalServerErrorException(
        'Something went wrong in the server',
      );
    }
  }
}
