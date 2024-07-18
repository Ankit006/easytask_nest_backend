import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { MemberRoleGuard } from 'src/members/members.guard';
import { MemberRoles } from 'src/members/members.role';
import { SprintsService } from './sprints.service';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import {
  AssingBacklogDto,
  UpdateSprintFormValidation,
  assingBacklogValidation,
  sprintFormValidation,
} from './sprints.validation';
import { SprintDto } from 'src/database/database.schema';
import { Request } from 'express';

@Controller('sprints')
@UseGuards(MemberRoleGuard)
export class SprintsController {
  constructor(private sprintsService: SprintsService) {}

  @Post()
  @MemberRoles('admin', 'moderator')
  @UsePipes(new ZodValidationPipe(sprintFormValidation))
  async create(@Body() sprintDto: SprintDto) {
    return this.sprintsService.create(sprintDto);
  }

  @Put()
  @MemberRoles('admin', 'moderator')
  @UsePipes(new ZodValidationPipe(UpdateSprintFormValidation))
  async update(@Body() sprintDto: SprintDto) {
    return this.sprintsService.update(sprintDto);
  }

  @Get('/:projectId')
  async getAll(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.sprintsService.getAll(projectId);
  }

  @Get('/sprint/:sprintId')
  async get(@Param('sprintId', ParseIntPipe) sprintId: number) {
    return this.sprintsService.get(sprintId);
  }

  @Get('/:projectId/:sprintId/userStory')
  async userStory(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('sprintId', ParseIntPipe) sprintId: number,
    @Req() request: Request,
  ) {
    return this.sprintsService.getUserStories(request, projectId, sprintId);
  }

  @Delete('/sprint/:sprintId')
  async remove(@Param('sprintId', ParseIntPipe) sprintId: number) {
    return this.sprintsService.remove(sprintId);
  }

  @Put('/assign')
  @UsePipes(new ZodValidationPipe(assingBacklogValidation))
  async assignBacklog(@Body() assingbacklogDto: AssingBacklogDto) {
    return this.sprintsService.assingBackLog(assingbacklogDto);
  }

  @Delete('/assign/:backlogId')
  async removeUserStory(@Param('backlogId', ParseIntPipe) backlogId: number) {
    return this.sprintsService.removeUserStory(backlogId);
  }
}
