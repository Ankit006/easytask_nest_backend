import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get('/current')
  async get(@Req() request: Request) {
    return this.usersService.getUser(request['user'].id);
  }
}
