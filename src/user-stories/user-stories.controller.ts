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
import { UserStoriesService } from './user-stories.service';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { userStoryDtoValidation } from './user-stories.validation';
import { MemberRoles } from 'src/members/members.role';
import { UserStoryDto } from 'src/database/database.schema';

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
}
