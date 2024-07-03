import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { customProvier } from 'src/constants';
import { TaskCommentDto, taskComments } from 'src/database/database.schema';
import { DB_CLIENT } from 'src/types';
import { handleExceptionThrow } from 'src/utils';

@Injectable()
export class TaskCommentsService {
  constructor(@Inject(customProvier.DB_CLIENT) private dbClient: DB_CLIENT) {}

  async postComment(taskCommentDto: TaskCommentDto) {
    try {
      await this.dbClient.insert(taskComments).values(taskCommentDto);
      return { message: 'Comment posted' };
    } catch (err) {
      handleExceptionThrow(err);
    }
  }

  async deleteCommnet(commentId: number) {
    try {
      await this.dbClient
        .delete(taskComments)
        .where(eq(taskComments.id, commentId));
      return { message: 'Commnet is removed' };
    } catch (err) {
      handleExceptionThrow(err);
    }
  }

  async getComments(taskId: number) {
    try {
      const res = await this.dbClient.query.taskComments.findMany({
        where: eq(taskComments.taskId, taskId),
      });
      return res;
    } catch (err) {
      handleExceptionThrow(err);
    }
  }
}
