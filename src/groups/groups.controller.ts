import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { createGroupValidation } from './groups.validation';
import { GroupDto } from 'src/database/database.schema';
import { MemberRoleGuard } from 'src/members/members.guard';
import { MemberRoles } from 'src/members/members.role';

@Controller('groups')
@UseGuards(MemberRoleGuard)
export class GroupsController {
  constructor(private groupService: GroupsService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createGroupValidation))
  async create(@Body() groupDto: GroupDto) {
    return await this.groupService.create(groupDto);
  }

  @Get('/:projectId')
  @MemberRoles('admin', 'moderator')
  async getGroups(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.groupService.getAll(projectId);
  }
}
