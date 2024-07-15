import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { customProvier } from 'src/constants';
import { StatusType, TaskDto, tasks } from 'src/database/database.schema';
import { DB_CLIENT } from 'src/types';
import { handleExceptionThrow } from 'src/utils';
import { ChangeTaskStatusDto } from './task.validationtion';

@Injectable()
export class TasksService {
  constructor(@Inject(customProvier.DB_CLIENT) private dbClient: DB_CLIENT) {}

  async create(taskDto: TaskDto) {
    try {
      await this.dbClient.insert(tasks).values(taskDto);
      return { message: 'Task is created' };
    } catch (err) {
      handleExceptionThrow(err);
    }
  }

  async get(userStoryId: number) {
    try {
      const res = await this.dbClient.query.tasks.findMany({
        where: eq(tasks.userStoryId, userStoryId),
      });
      return res;
    } catch (err) {
      handleExceptionThrow(err);
    }
  }
  async changeTaskStatus(changeTaskStatusDto: ChangeTaskStatusDto) {
    try {
      await this.dbClient
        .update(tasks)
        .set({ status: changeTaskStatusDto.status as StatusType })
        .where(eq(tasks.id, changeTaskStatusDto.taskId));
      return { message: 'Task is updated' };
    } catch (err) {
      handleExceptionThrow(err);
    }
  }
}
