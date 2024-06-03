import { Inject, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { customProvier } from 'src/constants';
import {
  GroupDto,
  groups,
  membersToGroups,
} from 'src/database/database.schema';
import { DB_CLIENT } from 'src/types';
import { handleExceptionThrow } from 'src/utils';

@Injectable()
export class GroupsService {
  constructor(@Inject(customProvier.DB_CLIENT) private dbClient: DB_CLIENT) {}

  async create(groupDto: GroupDto) {
    try {
      await this.dbClient.insert(groups).values(groupDto);
      return { message: 'Group is added' };
    } catch (err) {
      handleExceptionThrow(err);
    }
  }

  async getAll(projectId: number) {
    try {
      const res = await this.dbClient.query.groups.findMany({
        where: eq(groups.project_id, projectId),
      });
      return res;
    } catch (err) {
      handleExceptionThrow(err);
    }
  }

  async assign(groupId: number, memberId: number) {
    try {
      await this.dbClient.insert(membersToGroups).values({
        groupId,
        memberId,
      });
      return { message: 'group is assigned' };
    } catch (err) {
      handleExceptionThrow(err);
    }
  }

  async unassign(groupId: number, memberId: number) {
    try {
      await this.dbClient
        .delete(membersToGroups)
        .where(
          and(
            eq(membersToGroups.memberId, memberId),
            eq(membersToGroups.groupId, groupId),
          ),
        );
      return { message: 'Group is unassigned' };
    } catch (err) {
      handleExceptionThrow(err);
    }
  }

  async remove(groupId: number) {
    try {
      await this.dbClient.delete(groups).where(eq(groups.id, groupId));
      return { message: 'Group is removed' };
    } catch (err) {
      handleExceptionThrow(err);
    }
  }
}
