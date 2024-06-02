import { Body, Controller, Get, Post, Req, UsePipes } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { JoinProjectDto, joinProjectValidation } from './user.validation';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get('/current')
  async get(@Req() request: Request) {
    return await this.usersService.getUser(request['user'].id);
  }

  @Post('/join')
  @UsePipes(new ZodValidationPipe(joinProjectValidation))
  async join(@Body() joinProjectDto: JoinProjectDto, @Req() request: Request) {
    return await this.usersService.joinProject(
      joinProjectDto.project_id,
      request['user'].id,
      joinProjectDto.notification,
    );
  }
}
