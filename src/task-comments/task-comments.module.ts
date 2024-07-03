import { Module } from '@nestjs/common';
import { TaskCommentsService } from './task-comments.service';
import { TaskCommentsController } from './task-comments.controller';

@Module({
  providers: [TaskCommentsService],
  controllers: [TaskCommentsController],
})
export class TaskCommentsModule {}
