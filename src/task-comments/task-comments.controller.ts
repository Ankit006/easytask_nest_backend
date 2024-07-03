import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { TaskCommentsService } from './task-comments.service';
import { taskCommentvalidation } from './task-commnets.validation';
import { TaskCommentDto } from 'src/database/database.schema';

@Controller('task-comments')
export class TaskCommentsController {
  constructor(private taskCommentsService: TaskCommentsService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(taskCommentvalidation))
  async add(@Body() taskCommentDto: TaskCommentDto) {
    return this.taskCommentsService.postComment(taskCommentDto);
  }

  @Get('/:taskId')
  async get(@Param('taskId', ParseIntPipe) taskId: number) {
    return this.taskCommentsService.getComments(taskId);
  }

  @Delete('/:commnetId')
  async deleteComment(@Param('commentId', ParseIntPipe) commnetId: number) {
    return this.taskCommentsService.deleteCommnet(commnetId);
  }
}
