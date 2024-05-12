import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { IProject, ProjectDto } from 'src/database/database.schema';
import { MemberRoleGuard } from 'src/members/members.guard';
import { MemberRoles } from 'src/members/members.role';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { ProjectsService } from './projects.service';
import {
  createProjectsValidation,
  removeProjectValidation,
  updateProjectValidation,
} from './projects.validation';

@Controller('projects')
@UseGuards(MemberRoleGuard)
export class ProjectsController {
  constructor(private projectService: ProjectsService) {}

  @Post('create')
  @UsePipes(new ZodValidationPipe(createProjectsValidation))
  async create(@Body() projectDto: ProjectDto, @Req() request: Request) {
    return await this.projectService.create({ request, ...projectDto });
  }

  @Put('update')
  @MemberRoles('admin')
  @UsePipes(new ZodValidationPipe(updateProjectValidation))
  async update(@Body() projectDto: IProject) {
    return await this.projectService.update(projectDto);
  }

  @Get()
  async all(@Req() request: Request) {
    return await this.projectService.getAll(request);
  }

  @Get('/:projectId')
  async get(@Param('projectId') projectId: string) {
    return this.projectService.get(projectId);
  }

  @Post('remove')
  @MemberRoles('admin')
  @UsePipes(new ZodValidationPipe(removeProjectValidation))
  async remove(@Body() projectDto: ProjectDto) {
    return await this.projectService.remove(projectDto);
  }
}
