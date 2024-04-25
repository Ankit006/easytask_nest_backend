import { Body, Controller, Post, Req, UsePipes } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import {
  CreateProjectDto,
  createProjectsValidation,
} from './projects.validation';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';

@Controller('projects')
export class ProjectsController {
  constructor(private projectService: ProjectsService) {}

  @Post('create')
  @UsePipes(new ZodValidationPipe(createProjectsValidation))
  async create(@Body() projectDto: CreateProjectDto, @Req() request: Request) {
    return this.projectService.create({ request, ...projectDto });
  }
}
