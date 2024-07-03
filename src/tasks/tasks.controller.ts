import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
} from '@nestjs/common';
import { TaskDto } from 'src/database/database.schema';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { taskValidation } from './task.validationtion';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}
  @Post()
  @UsePipes(new ZodValidationPipe(taskValidation))
  async create(@Body() taskDto: TaskDto) {
    return await this.tasksService.create(taskDto);
  }

  @Get('/:userStoryId')
  async get(@Param('userStoryId', ParseIntPipe) userStoryId: number) {
    return await this.tasksService.get(userStoryId);
  }
}
