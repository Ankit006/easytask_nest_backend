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
import { UserStoriesService } from './user-stories.service';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import {
  userStoryDtoValidation,
  userStoryUpdateValidation,
} from './user-stories.validation';
import { MemberRoles } from 'src/members/members.role';
import { UserStoryDto } from 'src/database/database.schema';
import { Request } from 'express';
@Controller('user-stories')
@UseGuards(MemberRoleGuard)
export class UserStoriesController {
  constructor(private userStoriesService: UserStoriesService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(userStoryDtoValidation))
  @MemberRoles('admin', 'moderator')
  async create(@Body() userStoryDto: UserStoryDto) {
    return this.userStoriesService.create(userStoryDto);
  }

  @Put()
  @UsePipes(new ZodValidationPipe(userStoryUpdateValidation))
  @MemberRoles('admin', 'moderator')
  async update(@Body() userStoryDto: UserStoryDto) {
    return this.userStoriesService.update(userStoryDto);
  }

  @Get('/backlogs/:projectId')
  @MemberRoles('admin', 'moderator')
  async backlogs(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.userStoriesService.getBacklogs(projectId);
  }

  @Get('/:userStoryId')
  async get(@Param('userStoryId', ParseIntPipe) userStoryId: number) {
    return this.userStoriesService.get(userStoryId);
  }

  @Delete('/:userStoryId')
  @MemberRoles('admin', 'moderator')
  async delete(@Param('userStoryId', ParseIntPipe) userStoryId: number) {
    return this.userStoriesService.delete(userStoryId);
  }

  @Post('/assign-member/:projectId/:userStoryId')
  @MemberRoles('admin', 'moderator')
  async assignMember(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('userStoryId', ParseIntPipe) userStoryId: number,
    @Req() request: Request,
  ) {
    return this.userStoriesService.assignMember(
      request,
      projectId,
      userStoryId,
    );
  }

  @Delete('/assign-member/:projectId/:userStoryId')
  @MemberRoles('admin', 'moderator')
  async removeMember(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('userStoryId', ParseIntPipe) userStoryId: number,
    @Req() request: Request,
  ) {
    return this.userStoriesService.removeMember(
      request,
      projectId,
      userStoryId,
    );
  }
}
