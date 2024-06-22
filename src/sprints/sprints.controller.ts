import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { MemberRoleGuard } from 'src/members/members.guard';
import { MemberRoles } from 'src/members/members.role';
import { SprintsService } from './sprints.service';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { sprintFormValidation } from './sprints.validation';
import { SprintDto } from 'src/database/database.schema';

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

  @Get('/:projectId')
  async getAll(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.sprintsService.getAll(projectId);
  }

  @Get('/sprint/:sprintId')
  async get(@Param('sprintId', ParseIntPipe) sprintId: number) {
    return this.sprintsService.get(sprintId);
  }

  @Delete('/sprint/:sprintId')
  async remove(@Param('sprintId', ParseIntPipe) sprintId: number) {
    return this.sprintsService.remove(sprintId);
  }
}
