import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { customProvier } from 'src/constants';
import {
  GroupDto,
  IGroup,
  groups,
  membersToGroups,
} from 'src/database/database.schema';
import { DB_CLIENT } from 'src/types';
import { handleExceptionThrow } from 'src/utils';
import { AssingGroupDto, UnAssingGroupDto } from './groups.validation';

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

  async getAssignedgroups(memberId: number) {
    try {
      const res = await this.dbClient.query.membersToGroups.findMany({
        where: eq(membersToGroups.memberId, memberId),
        with: {
          group: true,
        },
      });
      const groups: IGroup[] = [];

      for (const value of res) {
        groups.push(value.group);
      }
      return groups;
    } catch (err) {
      handleExceptionThrow(err);
    }
  }

  async assign({ groupId, memberId, projectId }: AssingGroupDto) {
    try {
      const res = await this.dbClient.query.membersToGroups.findFirst({
        where: and(
          eq(membersToGroups.memberId, memberId),
          eq(membersToGroups.groupId, groupId),
          eq(membersToGroups.projectId, projectId),
        ),
      });
      if (res) {
        throw new ConflictException('member already assigned to this group');
      }
      await this.dbClient.insert(membersToGroups).values({
        groupId,
        memberId,
        projectId,
      });
      return { message: 'group is assigned' };
    } catch (err) {
      handleExceptionThrow(err);
    }
  }

  async unassign({ groupId, memberId }: UnAssingGroupDto) {
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
