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
import { GroupsService } from './groups.service';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import {
  AssingGroupDto,
  UnAssingGroupDto,
  assignGroupValidation,
  createGroupValidation,
  unAsignGroupValidation,
} from './groups.validation';
import { GroupDto } from 'src/database/database.schema';
import { MemberRoleGuard } from 'src/members/members.guard';
import { MemberRoles } from 'src/members/members.role';

@Controller('groups')
@UseGuards(MemberRoleGuard)
export class GroupsController {
  constructor(private groupService: GroupsService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createGroupValidation))
  @MemberRoles('admin', 'moderator')
  async create(@Body() groupDto: GroupDto) {
    return await this.groupService.create(groupDto);
  }

  @Get('/:projectId')
  @MemberRoles('admin', 'moderator')
  async getGroups(@Param('projectId', ParseIntPipe) projectId: number) {
    return await this.groupService.getAll(projectId);
  }

  @Get('/member/:memberId')
  async getAssingedGroups(@Param('memberId', ParseIntPipe) memberId: number) {
    return await this.groupService.getAssignedgroups(memberId);
  }

  @Post('/member/assign')
  @UsePipes(new ZodValidationPipe(assignGroupValidation))
  async assignGroup(@Body() assingnGroupDto: AssingGroupDto) {
    return await this.groupService.assign(assingnGroupDto);
  }

  @Post('/member/unassign')
  @UsePipes(new ZodValidationPipe(unAsignGroupValidation))
  async unassignGroup(@Body() unassignGroupDto: UnAssingGroupDto) {
    return await this.groupService.unassign(unassignGroupDto);
  }

  @Delete('/:groupId')
  @MemberRoles('admin', 'moderator')
  async removeGroup(@Param('groupId', ParseIntPipe) groupId: number) {
    return await this.groupService.remove(groupId);
  }
}
