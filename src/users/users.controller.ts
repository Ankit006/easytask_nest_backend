import { Controller, Get, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get('/current')
  async get(@Req() request: Request) {
    return this.usersService.getUser(request['user'].id);
  }

  @Get('/notifications')
  async notifications(@Req() request: Request) {
    return this.usersService.notifications(request['user'].id);
  }
}
